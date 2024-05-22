export default class Product {
    id: string;
    features: string[];
    slug: string;
    name: string;

    constructor(id: string, slug: string, name: string, features: string[]) {
        this.id = id;
        this.slug = slug; 
        this.name = name;
        this.features = features;
    }
}