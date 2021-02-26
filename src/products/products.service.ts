import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AVAILABLE_LANGS } from 'src/constants/constants';
import { ProductInfo } from 'src/entities/product-info.entity';
import { Product } from 'src/entities/product.entity';
import { ProductsInterface } from 'src/products/products.interface';
import { ProductInfosRepository } from 'src/repositories/product-infos.repository';
import { ProductsRepository } from 'src/repositories/protucts.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { ProductDto } from './dto/product.dto';
import * as path from 'path'
import * as fs from 'fs'
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService implements ProductsInterface {
    constructor(
        @InjectRepository(ProductsRepository)
        private productsRepository: ProductsRepository,
        @InjectRepository(ProductInfosRepository)
        private productInfosRepository: ProductInfosRepository
    ) {}
    
    async getProducts(filterDto: GetProductsFilterDto, lang: string): Promise<ProductDto[]> {
        const query = this.productInfosRepository.createQueryBuilder('info')
        query.select('info.productId')
        query.addSelect('info.name')
        query.addSelect('product.image')
        query.addSelect('product.price')
        query.addSelect('product.discount')

        query.where('info.lang = :lang', { lang })

        if (filterDto.search) {
            query.andWhere('(info.name ILIKE :search OR info.description ILIKE :search)', { search: `%${filterDto.search}%` })
        }

        query.leftJoinAndSelect('info.product', 'product')
        query.andWhere('product.available = TRUE')

        if (filterDto.categoryId) {

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
        const product = await this.productsRepository.findOne(id)

        if (!product) {
            throw new NotFoundException()
        }

        let info = await this.productInfosRepository.findOne({ productId: id, lang: lang })
        if (!info) {
            info = await this.productInfosRepository.findOne({ productId: id, lang: 'en' })
            if (!info) {
                info = await this.productInfosRepository.findOne({ productId: id })
            }
        }

        const productDto: ProductDto = {
            id: product.id,
            name: info.name,
            description: info.description,
            image: product.image,
            volumeModel: product.volumeModel,
            price: product.price,
            discount: product.discount,
            available: product.available
        }

        return productDto
    }

    async createProduct(createProductDto: CreateProductDto): Promise<{ id: number }> {
        try {
            fs.accessSync(path.resolve('uploads', createProductDto.image), fs.constants.F_OK)
            fs.accessSync(path.resolve('uploads', createProductDto.volumeModel), fs.constants.F_OK)
        } catch (err) {
            throw new BadRequestException()
        }

        const product = new Product()
        product.image = createProductDto.image
        product.volumeModel = createProductDto.volumeModel
        product.price = createProductDto.price
        product.discount = createProductDto.discount
        product.available = true
        await product.save()

        const productInfo = new ProductInfo()
        productInfo.productId = product.id
        productInfo.lang = createProductDto.lang
        productInfo.name = createProductDto.name
        productInfo.description = createProductDto.description
        await productInfo.save()

        return { id: product.id }
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<void> {
        const product = await this.productsRepository.findOne(id)

        if (!product) {
            throw new NotFoundException()
        }

        const { image, volumeModel } = updateProductDto

        if (image && image !== product.image) {
            fs.access(path.resolve('uploads', image), fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.rm(path.resolve('uploads', product.image), () => {})
                    product.image = image
                }
            })
        }

        if (volumeModel && volumeModel !== product.volumeModel) {
            fs.access(path.resolve('uploads', volumeModel), fs.constants.F_OK, (err) => {
                if (!err) {
                    fs.rm(path.resolve('uploads', product.volumeModel), () => {})
                    product.volumeModel = volumeModel
                }
            })
        }

        product.price = updateProductDto.price
        product.discount = updateProductDto.discount
        await product.save()

        let productInfo = await this.productInfosRepository.findOne({ productId: id, lang: updateProductDto.lang })

        if (!productInfo) {
            productInfo = new ProductInfo()
            productInfo.productId = id
            productInfo.lang = updateProductDto.lang
        }

        productInfo.name = updateProductDto.name
        productInfo.description = updateProductDto.description
        await productInfo.save()
    }

    async updateProductPrice(id: number, price: number): Promise<void> {
        const product = await this.productsRepository.findOne(id)

        if (!product) {
            throw new NotFoundException()
        }

        product.price = price
        await product.save()
    }

    async updateProductDiscount(id: number, discount: number): Promise<void> {
        const product = await this.productsRepository.findOne(id)

        if (!product) {
            throw new NotFoundException()
        }

        product.discount = discount
        await product.save()
    }

    async unavailableProduct(id: number): Promise<void> {
        const product = await this.productsRepository.findOne(id)

        if (!product) {
            throw new NotFoundException()
        }

        product.available = false
        await product.save()
    }

    async availableProduct(id: number): Promise<void> {
        const product = await this.productsRepository.findOne(id)

        if (!product) {
            throw new NotFoundException()
        }

        product.available = false
        await product.save()
    }
}
