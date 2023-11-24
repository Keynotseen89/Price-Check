export function discountPrice(originalPrice: number, discountPercent: number){
    return (originalPrice - (discountPercent * originalPrice / 100))
}