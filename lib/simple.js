class NeuralNetwork {
    constructor(input_nodes, hidden_nodes, output_nodes) {
        this.input_nodes = input_nodes;
        this.hidden_nodes = hidden_nodes;
        this.output_nodes = output_nodes;
    }
}


class Matrix {
    constructor(rows, columns) {
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
    /*multiply(n) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                this.data[i][j] *= n;
            }
        }
    }*/
    multiply(param) {
        if (param instanceof Matrix) {
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
    }


    add(param) {
        if (param instanceof Matrix && (param.rows != this.rows || param.columns != this.columns)) return;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let x = param instanceof Matrix ? param.data[i][j] : param;
                this.data[i][j] += x;
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
}
