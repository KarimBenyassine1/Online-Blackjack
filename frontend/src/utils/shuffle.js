export default function shuffle(array){
    // Shuffles cards randomly
    for(let i =array.length-1; i>0; i--){
        const newIndex = Math.floor(Math.random()*(i+1))
        const temp = array[newIndex]
        array[newIndex] = array[i]
        array[i] = temp
    }
}