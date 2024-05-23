export default class Product {
    id: string;
    features: string[];
    name: string;

    constructor(id: string, name: string, features: string[]) {
        this.id = id;
        this.name = name;
        this.features = features;
    }
}