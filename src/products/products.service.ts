import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { ProductDto } from './dto/product.dto';
import { ProductRepository } from 'src/common/repositories/protuct.repository';
import { Product } from 'src/common/entities/product.entity';
import { ProductSize } from 'src/common/entities/product-size.entity';
import { ProductColor } from 'src/common/entities/product-color.entity';
import { ProductSizeRepository } from 'src/common/repositories/product-size.repository';
import { ProductColorRepository } from 'src/common/repositories/product-color.repository';
import { ProductsDto } from './dto/products.dto';
import * as moment from 'moment';
import { QuantitiesDto } from './dto/quantities.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductRepository)
        private productRepository: ProductRepository,

        @InjectRepository(ProductColorRepository)
        private productColorRepository: ProductColorRepository,

        @InjectRepository(ProductSizeRepository)
        private productSizeRepository: ProductSizeRepository
    ) {}

    async getProducts(filterDto: GetProductsFilterDto): Promise<ProductsDto> {
        const query = this.productRepository.createQueryBuilder('product')
        query.select('product.id')
        query.addSelect('product.name')
        query.addSelect('brand.name')
        query.addSelect('product.image')
        query.addSelect('product.price')

        query.innerJoin('product.brand', 'brand')
        query.innerJoin('product.colors', 'color')
        query.innerJoin('color.sizes', 'size')

        if (filterDto.search) {
            query.andWhere(
                '(product.name ILIKE :search OR product.description ILIKE :search OR brand.name ILIKE :search)',
                { search: `%${filterDto.search}%` }
            )
        }

        if (filterDto.brandId) {
            query.andWhere('product.brandId = :brandId', { brandId: filterDto.brandId })
        }

        if (filterDto.typeId) {
            query.andWhere('product.typeId = :typeId', { typeId: filterDto.typeId })
        }

        if (filterDto.genderId) {
            query.andWhere('product.genderId = :genderId', { genderId: filterDto.genderId })
        }

        if (filterDto.seasonId) {
            query.andWhere('product.seasonId = :seasonId', { seasonId: filterDto.seasonId })
        }

        if (filterDto.size) {
            query.andWhere('size.size = :size', { size: filterDto.size })
        }

        if (filterDto.minPrice) {
            query.andWhere('product.price >= :minPrice', { minPrice: filterDto.minPrice })
        }

        if (filterDto.maxPrice) {
            query.andWhere('product.price <= :maxPrice', { maxPrice: filterDto.maxPrice })
        }

        if (filterDto.minQuantity) {
            query.andWhere('size.quantity <= :quantity', { quantity: filterDto.minQuantity })
        }

        const productsCount = await query.getCount()

        if (filterDto.page) {
            if (filterDto.take) {
                query.skip(filterDto.take * (filterDto.page - 1))
            } else {
                query.skip(20 * (filterDto.page - 1))
            }
        }

        const pageSize = filterDto.take ? filterDto.take : 20
        query.take(pageSize)

        const products = await query.getMany()
        return {
            pageCount: Math.ceil(productsCount / pageSize),
            products: products.map(product => ({
                id: product.id,
                name: product.name,
                brand: product.brand.name,
                image: product.image,
                price: product.price
            }))
        } 
    }

    async getProduct(id: number): Promise<ProductDto> {
        const query = this.productRepository.createQueryBuilder('product')
        query.where('product.id = :id', { id })
        query.innerJoinAndSelect('product.brand', 'brand')
        query.innerJoinAndSelect('product.type', 'type')
        query.innerJoinAndSelect('product.gender', 'gender')
        query.innerJoinAndSelect('product.season', 'season')
        query.leftJoinAndSelect('product.colors', 'productColor')
        query.leftJoinAndSelect('productColor.color', 'color')
        query.leftJoinAndSelect('productColor.sizes', 'size')
        query.leftJoinAndSelect('product.orders', 'order', 'order.estimation IS NOT NULL')
        query.leftJoinAndSelect('order.user', 'user')

        query.orderBy('size.size')
        query.addOrderBy('productColor.colorId')
        query.addOrderBy('order.estimationDate', 'DESC')

        const product = await query.getOne()

        if (!product) {
            throw new NotFoundException('There is no product with this id', 'ProductNotFound')
        }

        let average = null
        if (product.orders.length > 0) {
            let sum = 0
            product.orders.forEach(order => sum += order.estimation)
            average = sum / product.orders.length
        }

        return {
            id: product.id,
            name: product.name,
            description: product.description,
            brandId: product.brandId,
            brand: product.brand.name,
            typeId: product.typeId,
            type: product.type.name,
            genderId: product.genderId,
            gender: product.gender.name,
            seasonId: product.seasonId,
            season: product.season.name,
            image: product.image,
            volumeModel: product.volumeModel,
            liningMaterial: product.liningMaterial,
            soleMaterial: product.soleMaterial,
            insoleMaterial: product.insoleMaterial,
            price: product.price,
            averageEstimation: average,
            sizes: product.colors.length > 0 ? product.colors[0].sizes.map(size => size.size).sort() : [],
            colors: product.colors.map(color => ({
                colorId: color.colorId,
                color: color.color.name,
                texture: color.texture,
                sizes: color.sizes.map(size => ({
                    size: size.size,
                    quantity: size.quantity
                }))
            })),
            estimations: product.orders.map(order => ({
                firstName: order.user.firstName,
                lastName: order.user.lastName,
                estimation: order.estimation,
                comment: order.comment,
                estimationDate: order.estimationDate
                    ? moment(order.estimationDate.setHours(order.estimationDate.getHours() + 3)).format('DD.MM.YYYY HH:mm')
                    : null
            }))
        }
    }

    async getQuantities(id: number): Promise<QuantitiesDto> {
        const { price } = await this.productRepository.findOne(id, { select: ['price'] })

        if (!price) {
            throw new NotFoundException('There is no product with this id', 'ProductNotFound')
        }

        const colors = await this.productColorRepository.find({ productId: id })

        const query = this.productSizeRepository.createQueryBuilder('size')
        query.where('size.colorId IN (:...colorIds)', { colorIds: colors.map(color => color.id) })

        query.innerJoinAndSelect('size.color', 'productColor')
        query.innerJoinAndSelect('productColor.color', 'color')

        query.orderBy('productColor.colorId')
        query.addOrderBy('size.size')

        const sizes = await query.getMany()

        return {
            price,
            quantities: sizes.map(size => ({
                size: size.size,
                colorId: size.color.colorId,
                color: size.color.color.name,
                quantity: size.quantity
            }))
        } 
    }

    async createProduct(createProductDto: CreateProductDto): Promise<{ id: number }> {
        const product = new Product()
        product.name = createProductDto.name
        product.description = createProductDto.description
        product.brandId = createProductDto.brandId
        product.typeId = createProductDto.typeId
        product.genderId = createProductDto.genderId
        product.seasonId = createProductDto.seasonId
        product.image = createProductDto.image
        product.volumeModel = createProductDto.volumeModel
        product.price = createProductDto.price
        product.discount = 0 //createProductDto.discount
        product.liningMaterial = createProductDto.liningMaterial
        product.soleMaterial = createProductDto.soleMaterial
        product.insoleMaterial = createProductDto.insoleMaterial
        await product.save()

        for (const color of createProductDto.colors) {
            const productColor = new ProductColor()
            productColor.productId = product.id
            productColor.colorId = color.colorId
            productColor.texture = color.texture
            await productColor.save()

            for (const size of createProductDto.sizes) {
                const productSize = new ProductSize()
                productSize.colorId = productColor.id
                productSize.size = size
                productSize.quantity = 0
                await productSize.save()
            }
        }

        return { id: product.id }
    }

    async updateProduct(id: number, updateProductDto: CreateProductDto): Promise<{ id: number }> {
        const product = await this.productRepository.findOne(id)
        if (!product) {
            throw new NotFoundException('There is no product with this id', 'ProductNotFound')
        }

        product.name = updateProductDto.name
        product.description = updateProductDto.description
        product.brandId = updateProductDto.brandId
        product.typeId = updateProductDto.typeId
        product.genderId = updateProductDto.genderId
        product.seasonId = updateProductDto.seasonId
        product.image = updateProductDto.image
        product.volumeModel = updateProductDto.volumeModel
        product.price = updateProductDto.price
        product.liningMaterial = updateProductDto.liningMaterial
        product.soleMaterial = updateProductDto.soleMaterial
        product.insoleMaterial = updateProductDto.insoleMaterial
        await product.save()

        const query = this.productColorRepository.createQueryBuilder('color')
        query.where('color.productId = :id', { id })
        query.andWhere('color.colorId NOT IN (:...colorIds)', { colorIds: updateProductDto.colors.map(color => color.colorId) })
        const deletedColors = await query.getMany()
        await this.productColorRepository.remove(deletedColors)

        for (const color of updateProductDto.colors) {
            let productColor = await this.productColorRepository.findOne({ productId: id, colorId: color.colorId })

            if (productColor) {
                productColor.texture = color.texture
                await productColor.save()

                const query = this.productSizeRepository.createQueryBuilder('size')
                query.where('size.colorId = :colorId', { colorId: productColor.id })
                query.andWhere('size.size NOT IN (:...sizes)', { sizes: updateProductDto.sizes })
                const deletedSizes = await query.getMany()
                await this.productSizeRepository.remove(deletedSizes)

                for (const size of updateProductDto.sizes) {
                    let productSize = await this.productSizeRepository.findOne({ size, colorId: productColor.id })
                    if (!productSize) {
                        productSize = new ProductSize()
                        productSize.colorId = productColor.id
                        productSize.size = size
                        productSize.quantity = 0
                        await productSize.save()
                    }
                }

            } else {
                productColor = new ProductColor()
                productColor.productId = id
                productColor.colorId = color.colorId
                productColor.texture = color.texture
                await productColor.save()

                for (const size of updateProductDto.sizes) {
                    const productSize = new ProductSize()
                    productSize.colorId = productColor.id
                    productSize.size = size
                    productSize.quantity = 0
                    await productSize.save()
                }
            }
        }

        return { id }
    }

    async partialUpdateProductDto(id: number, updateProductDto: QuantitiesDto): Promise<{ id: number }> {
        const product = await this.productRepository.findOne(id)
        if (!product) {
            throw new NotFoundException('There is no product with this id', 'ProductNotFound')
        }

        product.price = updateProductDto.price
        await product.save()

        for (const quantity of updateProductDto.quantities) {
            const query = this.productSizeRepository.createQueryBuilder('size')
            query.where('size.size = :size', { size: quantity.size })
            query.innerJoinAndSelect(
                'size.color', 'color', 'color.productId = :productId AND color.colorId = :colorId',
                { productId: id, colorId: quantity.colorId }
            )

            const size = await query.getOne()
            size.quantity += quantity.quantity

            await size.save()
        }

        return { id }
    }

    async deleteProduct(id: number): Promise<{ id: number }> {
        const colors = await this.productColorRepository.find({ productId: id })
        await this.productColorRepository.remove(colors)

        return { id }
    }
}
