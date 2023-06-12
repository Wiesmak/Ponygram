import Model from "../../lib/model.ts"
import {History, Status, Tag} from "../../util/types.ts"
import {ObjectId} from "mongodb"
import {db} from "../../index.ts"
import sharp, {Sharp} from "sharp"
import ApplicationConfig from "../../config/application.ts"

export default class Image extends Model {
    private collection = db.collection('images')

    constructor(
        public album: string,
        public originalName: string,
        public author: ObjectId,
        public url: string,
        public lastChange?: Status,
        public history?: History[],
        public tags: Tag[] = [],
        public id?: ObjectId
    ) {
        super(id)
    }

    public static async find(id: ObjectId): Promise<Image> {
        const entity = await db.collection('images').findOne({_id: id})
        return entity ? new this(entity.album, entity.originalName, entity.author, entity.url, entity.lastChange, entity.history, entity.tags, entity._id) : null
    }

    public static async all(): Promise<Image[]> {
        const entities = await db.collection('images').find().toArray()
        return entities.map(entity => new this(entity.album, entity.originalName, entity.author, entity.url, entity.lastChange, entity.history, entity.tags, entity._id))
    }

    protected async getImage(): Promise<Sharp> {
        return sharp(this.url)
    }

    //region [Filters]
    public async rotate(options: {degrees: number}) {
        const image = await this.getImage()
        await image.rotate(options.degrees)
        const parts = this.url.split('/').at(-1).split('.')
        await image.toFile(`${ApplicationConfig.FILE_STORAGE + parts[0]}-rotated.${parts[1]}`)
    }

    public async resize(options: {width: number, height: number}) {
        const image = await this.getImage()
        await image.resize(options.width, options.height)
        const parts = this.url.split('/').at(-1).split('.')
        await image.toFile(`${ApplicationConfig.FILE_STORAGE + parts[0]}-resized.${parts[1]}`)
    }

    public async grayscale() {
        const image = await this.getImage()
        await image.grayscale()
        const parts = this.url.split('/').at(-1).split('.')
        await image.toFile(`${ApplicationConfig.FILE_STORAGE + parts[0]}-grayscale.${parts[1]}`)
    }

    public async blur(options: {sigma: number}) {
        const image = await this.getImage()
        await image.blur(options.sigma)
        const parts = this.url.split('/').at(-1).split('.')
        await image.toFile(`${ApplicationConfig.FILE_STORAGE + parts[0]}-blur.${parts[1]}`)
    }

    public async sharpen(options: {sigma: number}) {
        const image = await this.getImage()
        await image.sharpen(options.sigma)
        const parts = this.url.split('/').at(-1).split('.')
        await image.toFile(`${ApplicationConfig.FILE_STORAGE + parts[0]}-sharpen.${parts[1]}`)
    }

    public async reformat(options: {format: string}) {
        const image = await this.getImage()
        await image.toFormat(sharp.format[options.format])
        const parts = this.url.split('/').at(-1).split('.')
        await image.toFile(`${ApplicationConfig.FILE_STORAGE + parts[0]}-reformat.${options.format}`)
    }

    public async crop(options: {width: number, height: number, left: number, top: number}) {
        const image = await this.getImage()
        await image.extract({width: options.width, height: options.height, left: options.left, top: options.top})
        const parts = this.url.split('/').at(-1).split('.')
        await image.toFile(`${ApplicationConfig.FILE_STORAGE + parts[0]}-crop.${parts[1]}`)
    }

    public async flip(options: {horizontal: boolean, vertical: boolean}) {
        const image = await this.getImage()
        options.horizontal && await image.flop()
        options.vertical && await image.flip()
        const parts = this.url.split('/').at(-1).split('.')
        await image.toFile(`${ApplicationConfig.FILE_STORAGE + parts[0]}-flip.${parts[1]}`)
    }

    public async negate() {
        const image = await this.getImage()
        await image.negate()
        const parts = this.url.split('/').at(-1).split('.')
        await image.toFile(`${ApplicationConfig.FILE_STORAGE + parts[0]}-negate.${parts[1]}`)
    }

    public async tint(options: {r: number, g: number, b: number}) {
        const image = await this.getImage()
        await image.tint(options)
        const parts = this.url.split('/').at(-1).split('.')
        await image.toFile(`${ApplicationConfig.FILE_STORAGE + parts[0]}-tint.${parts[1]}`)
    }
    //endregion
}
