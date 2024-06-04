export const game_wins: { [k: string]: number[][] } = {
    3: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],

        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],

        [1, 5, 9],
        [3, 5, 7]
    ],
    4: [
        [1, 2, 3,], [2, 3, 4],
        [5, 6, 7], [6, 7, 8],
        [9, 10, 11], [10, 11, 12],
        [13, 14, 15], [14, 15, 16],

        [1, 5, 9], [5, 9, 13],
        [2, 6, 10], [6, 10, 14],
        [3, 7, 11], [7, 11, 15],
        [4, 8, 12], [8, 12, 16],

        [1, 6, 11], [6, 11, 16],
        [2, 7, 12], [5, 10, 15],

        [4, 7, 10], [7, 10, 13],
        [3, 6, 9], [8, 11, 14],
    ],


    5: [
        [1, 2, 3], [2, 3, 4], [3, 4, 5],
        [6, 7, 8], [7, 8, 9], [8, 9, 10],
        [11, 12, 13], [12, 13, 14], [13, 14, 15],
        [16, 17, 18], [17, 18, 19], [18, 19, 20],
        [21, 22, 23], [22, 23, 24], [23, 24, 25],

        [1, 6, 11], [6, 11, 16], [11, 16, 21],
        [2, 7, 12], [7, 12, 17], [12, 17, 22],
        [3, 8, 13], [8, 13, 18], [13, 18, 23],
        [4, 9, 14], [9, 14, 19], [14, 19, 24],
        [5, 10, 15], [10, 15, 20], [15, 20, 25],

        [3, 9, 15],
        [2, 8, 14], [8, 14, 20],
        [1, 7, 13], [7, 13, 19], [13, 19, 25],
        [6, 12, 18], [12, 18, 24],
        [11, 17, 23],

        [3, 7, 11],
        [4, 8, 12], [8, 12, 16],
        [5, 9, 13], [9, 13, 17], [13, 17, 21],
        [10, 14, 18], [14, 18, 22],
        [15, 19, 23]
    ],
};


export function index_to_xy(index: number, size: number) {
    index -= 1;
    return [index % size, math.floor(index / size)];
}

export function xy_to_index(x: number, y: number, size: number) {
    return x + y * size;
}