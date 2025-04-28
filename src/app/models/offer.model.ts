export interface Seller {
    id: number;
    name: string;
    isC2C: boolean;
    rating: number;
    completedOrders: number;
    feedback: {
        positive: number;
        neutral: number;
        negative: number;
    };
    merchantRating: number;
}

export interface KinguinOffer {
    id: string;
    productId: string;
    productName: string;
    productImageUrl: string;
    popularityValue: number;
    isPreorder: boolean;
    sellerId: number;
    type: string;
    price: {
        amount: number;
        currency: string;
    };
    seller: Seller;
    activeStockNumber: number;
    kinguinOffer: {
        kinguinCategoryId: string | null;
        kinguinProductId: string | null;
    };
    checkoutTypes: string[];
    broker: string;
    spaActive: boolean;
}

export interface OfferResponse {
    _embedded: {
        kinguinOffer: KinguinOffer[];
    };
    _links: {
        self: {
            href: string;
        };
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
    buyButton: KinguinOffer & {
        buyButtonPickType: string;
    };
}
