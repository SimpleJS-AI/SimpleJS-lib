class NeuralNetwork {
    constructor(input, hidden, output) {
        this.input = input;
        this.hidden = hidden;
        this.output = output;
    }
}


class Matrix {
    constructor(rows, columns) {  // Create a matrix
        this.rows = rows;
        this.columns = columns;
        this.data = [];
        for (let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] = 0;
            }
        }
    }

    multiply(param) { // multiply by another matrix
        if (param.rows != this.columns) return;
        let output = new Matrix(this.rows, param.columns);
        for (let i = 0; i < output.rows; i++) {
            for (let j = 0; j < output.columns; j++) {
                output.data[i][j] = 0;
                for (let k = 0; k < this.columns; k++) {
                    output.data[i][j] += this.data[i][k] * param.data[k][j];
                }
            }
        }
        return output;
    }

    scalarMultiply(param) { // multiply by a scalar
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] *= param;
            }
        }
    }

    add(param) {   // add another matrix or a scalar
        if (param instanceof Matrix && (param.rows != this.rows || param.columns != this.columns)) return; // if param is a matrix AND the dimensions are not the same -> return
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let x = param instanceof Matrix ? param.data[i][j] : param;
                this.data[i][j] += x;
            }
        }
    }

    mapData(f) { // apply a function to each element of the matrix
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] = f(this.data[i][j]);
            }
        }
    }

    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    swap() {
        let output = new Matrix(this.columns, this.rows);
        for (let i = 0; i < output.rows; i++) {
            for (let j = 0; j < output.columns; j++) {
                output.data[i][j] = this.data[j][i];
            }
        }
        return output;
    }

}
