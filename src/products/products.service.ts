import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { ProductDto } from './dto/product.dto';
import { ProductRepository } from 'src/common/repositories/protuct.repository';
import { ProductInfoRepository } from 'src/common/repositories/product-info.repository';
import { Product } from 'src/common/entities/product.entity';
import { ProductInfo } from 'src/common/entities/product-info.entity';
import { ProductSize } from 'src/common/entities/product-size.entity';
import { ProductSizeRepository } from 'src/common/repositories/product-size.repository';
import { ProductSizeDto } from './dto/product-size.dto';
import { CategoryRepository } from 'src/common/repositories/category.repository';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(ProductRepository)
        private productRepository: ProductRepository,

        @InjectRepository(ProductInfoRepository)
        private productInfoRepository: ProductInfoRepository,

        @InjectRepository(ProductSizeRepository)
        private productSizeRepository: ProductSizeRepository,

        @InjectRepository(CategoryRepository)
        private categoryRepository: CategoryRepository
    ) {}
    
    async getProducts(filterDto: GetProductsFilterDto, lang: string): Promise<ProductDto[]> {
        const query = this.productInfoRepository.createQueryBuilder('info')
        query.select('info.productId')
        query.addSelect('info.name')
        query.addSelect('product.image')
        query.addSelect('product.price')
        query.addSelect('product.discount')

        query.innerJoin('info.product', 'product')
        query.innerJoin('product.sizes', 'size')

        if (filterDto.categoryId) {
            query.innerJoin('product.categories', 'category', 'category.id = :id', { id: filterDto.categoryId })
        }

        query.where('info.lang = :lang', { lang })

        if (filterDto.search) {
            query.andWhere('(info.name ILIKE :search OR info.description ILIKE :search)', { search: `%${filterDto.search}%` })
        }

        if (filterDto.size) {
            query.andWhere('size.size = :size', { size: filterDto.size })
        }

        const products = await query.getMany()
        return products.map(product => {
            const productDto = new ProductDto()
            productDto.id = product.productId
            productDto.name = product.name
            productDto.image = product.product.image
            productDto.price = product.product.price
            productDto.discount = product.product.discount
            return productDto
        })
    }

    async getProduct(id: number, lang: string): Promise<ProductDto> {
        const product = await this.productRepository.findOne(id, { relations: ['sizes', 'categories'] })

        if (!product) {
            throw new NotFoundException('There is no product with this id')
        }

        let info = await this.productInfoRepository.findOne({ productId: id, lang: lang })
        if (!info) {
            info = await this.productInfoRepository.findOne({ productId: id, lang: 'ru' })
            if (!info) {
                info = await this.productInfoRepository.findOne({ productId: id })
            }
        }

        return {
            id: product.id,
            name: info.name,
            description: info.description,
            image: product.image,
            volumeModel: product.volumeModel,
            price: product.price,
            discount: product.discount,
            sizes: product.sizes.map(size => ({
                size: size.size,
                quantity: size.quantity
            })),
            categoryIds: product.categories.map(category => category.id)
        }
    }

    async createProduct(createProductDto: CreateProductDto): Promise<{ id: number }> {
        const product = new Product()
        product.image = createProductDto.image
        product.volumeModel = createProductDto.volumeModel
        product.price = createProductDto.price
        product.discount = createProductDto.discount
        const query = this.categoryRepository.createQueryBuilder('category')
        query.where('category.id IN (:...ids)', { ids: createProductDto.categoryIds })
        const categories = await query.getMany()
        product.categories = categories
        await product.save()

        const productInfo = new ProductInfo()
        productInfo.productId = product.id
        productInfo.lang = createProductDto.lang
        productInfo.name = createProductDto.name
        productInfo.description = createProductDto.description
        await productInfo.save()

        for (const size of createProductDto.sizes) {
            const productSize = new ProductSize()
            productSize.productId = product.id
            productSize.size = size
            productSize.quantity = 0
            await productSize.save()
        }

        return { id: product.id }
    }

    async updateProduct(id: number, createProductDto: CreateProductDto): Promise<{ id: number }> {
        const product = await this.productRepository.findOne(id)
        if (!product) {
            throw new NotFoundException('There is no product with this id')
        }

        product.image = createProductDto.image
        product.volumeModel = createProductDto.volumeModel
        product.price = createProductDto.price
        product.discount = createProductDto.discount
        const categoriesQuery = this.categoryRepository.createQueryBuilder('category')
        categoriesQuery.where('category.id IN (:...ids)', { ids: createProductDto.categoryIds })
        const categories = await categoriesQuery.getMany()
        product.categories = categories
        await product.save()

        let productInfo = await this.productInfoRepository.findOne({ productId: id, lang: createProductDto.lang })
        if (!productInfo) {
            productInfo = new ProductInfo()
            productInfo.productId = id
            productInfo.lang = createProductDto.lang
        }

        productInfo.name = createProductDto.name
        productInfo.description = createProductDto.description
        await productInfo.save()

        const query = this.productSizeRepository.createQueryBuilder('size')
        query.where('size.productId = :id', { id })
        query.andWhere('size.size NOT IN (:...sizes)', { sizes: createProductDto.sizes })
        const deletedSizes = await query.getMany()
        for (const size of deletedSizes) {
            await size.remove()
        }

        for (const size of createProductDto.sizes) {
            let productSize = await this.productSizeRepository.findOne({ productId: id, size })
            if (!productSize) {
                productSize = new ProductSize()
                productSize.productId = product.id
                productSize.size = size
                productSize.quantity = 0
                await productSize.save()
            }
        }

        return { id }
    }

    async updateProductPrice(id: number, price: number): Promise<{ id: number }> {
        const product = await this.productRepository.findOne(id)

        if (!product) {
            throw new NotFoundException('There is no product with this id')
        }

        product.price = price
        await product.save()

        return { id }
    }

    async updateProductDiscount(id: number, discount: number): Promise<{ id: number }> {
        const product = await this.productRepository.findOne(id)

        if (!product) {
            throw new NotFoundException('There is no product with this id')
        }

        product.discount = discount
        await product.save()

        return { id }
    }
}
