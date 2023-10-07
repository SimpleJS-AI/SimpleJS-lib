
class NeuralNetwork {
    constructor(input, hidden, output, lr = 0.1) {
        this.input = input;
        this.hidden = hidden;
        this.output = output;

        this.lr = lr;

        this._wInputHidden = math.zeros(this.hidden, this.input+1);
        this._wInputHidden = math.map(this._wInputHidden, () => Math.random() * 2 - 1);
        this._wHiddenOutput = math.zeros(this.output, this.hidden+1);
        this._wHiddenOutput = math.map(this._wHiddenOutput, () => Math.random() * 2 - 1);

        /*this.b_hidden = math.map(math.zeros(this.hidden), () => Math.random() * 2 - 1);
        this.b_output = math.map(math.zeros(this.output), () => Math.random() * 2 - 1);*/
        this._bHidden = 1;//Math.random() * 2 - 1;
        this._bOutput = 1;//Math.random() * 2 - 1;
    }

    _activation(x) {
        return 1 / (1 + Math.exp(-x));
    }

    _dActivation(x) {
        return x * (1 - x);
    }

    ff(input, debug = false) {
        if(input.length !== this.input) return false;
        input.push(this._bHidden);
        let inputMatrix = math.matrix(input);
        let hiddenMatrix = math.multiply(inputMatrix, math.transpose(this._wInputHidden));
        hiddenMatrix = math.map(hiddenMatrix, this._activation);
        hiddenMatrix = math.concat(hiddenMatrix, [this._bOutput]);  //Concat: add bias [1,2] + [3] = [1,2,3]
        let outputMatrix = math.multiply(hiddenMatrix, math.transpose(this._wHiddenOutput));
        outputMatrix = math.map(outputMatrix, this._activation);
        return debug ? [inputMatrix,hiddenMatrix,outputMatrix] : outputMatrix.toArray();
    }

    bp(desired_input, desired) {
        let input = [...desired_input];  //Copy array
        if(desired_input.length !== this.input || desired.length !== this.output) return false;
        let [inputMatrix, hiddenMatrix, outputMatrix] = this.ff(input, true);
        let e_output = math.subtract(desired, outputMatrix);
        let g_output = math.map(outputMatrix, this._dActivation);
        g_output = math.dotMultiply(g_output, e_output);
        let g_hidden = math.map(hiddenMatrix, this._dActivation);
        g_hidden._data.pop();
        g_hidden._size[0]--;
        g_hidden = math.dotMultiply(g_hidden, math.multiply(g_output, math.subset(this._wHiddenOutput, math.index(math.range(0, this._wHiddenOutput.size()[0]), math.range(0, this._wHiddenOutput.size()[1]-1)))));
        let d_output = math.multiply(math.transpose(math.matrix([g_output._data])), math.matrix([hiddenMatrix._data]));
        d_output = math.dotMultiply(d_output, this.lr);
        let d_hidden = math.multiply(math.transpose(math.matrix([g_hidden._data])), math.matrix([inputMatrix._data]));
        d_hidden = math.dotMultiply(d_hidden, this.lr);
        this._wHiddenOutput = math.add(this._wHiddenOutput, d_output);
        this._wInputHidden = math.add(this._wInputHidden, d_hidden);
        return [input, outputMatrix._data, e_output._data];

    }
}


class GeneticAlgorithm {
    constructor(populationSize, nnInput, nnHidden, nnOutput, nnLr = 0.1, objClass, ...args) {
        this.populationSize = populationSize;
        this.population = [];
        this.threshold = 0.8;
        this.gaLr = nnLr;
        for (let i = 0; i < this.populationSize; i++) {
            this.population.push(new Individual(nnInput, nnHidden, nnOutput, nnLr, objClass, ...args));
        }
    }
    setThreshold(threshold){
        this.threshold = threshold;
    }
    setLr(lr){
        this.gaLr = lr;
    }
    get(index) {
        return this.population[index].obj;
    }

    getFittest() {
        let fittest = this.population[0];
        for (let i = 1; i < this.populationSize; i++) {
            if (this.population[i].fitness > fittest.fitness) fittest = this.population[i];
        }
        return fittest;
    }

    forEach(func) {
        this.population.forEach(individual => func(individual.obj));
    }

    evolve(newSize = this.populationSize) {
        let newPopulation;
        newPopulation = this._selection(this.population);
        newPopulation = this._crossover(newPopulation, newSize);
        newPopulation = this._mutate(newPopulation);
        this.population = newPopulation;
        this.populationSize = this.population.length;
    }

    _selection(population) {
        let newPopulation = [];
        let fittest = this.getFittest();
        newPopulation.push(fittest);
        let threshold = fittest.fitness * this.threshold; // get every individual whose fitness is less than 20 percent worse than the fittest
        for (let i = 0; i < population.length; i++) {
            if (population[i].fitness >= threshold) {
                newPopulation.push(population[i]);
            }
        }
        return newPopulation;
    }

    _crossover(population, newSize) {
        let newPopulation = [];
        while(newPopulation.length > newSize + .5){
            newPopulation.push(population[math.floor(Math.random() * population.length - 1 ) + 1]);   //exclude fittest -> index 0
        }
        while(newPopulation.length < newSize){
            let p1 = population[math.floor(Math.random() * population.length)];
            let p2 = population[math.floor(Math.random() * population.length)];
            let child = new Individual(p1.nn.input, p1.nn.hidden, p1.nn.output, p1.nn.lr, p1.objClass, ...p1.args);
            for(let i = 0; i < child.nn._wInputHidden.size()[0]; i++){
                for(let j = 0; j < child.nn._wInputHidden.size()[1]; j++){
                    child.nn._wInputHidden._data[i][j] = Math.random() > .5 ? p2.nn._wInputHidden._data[i][j] : p1.nn._wInputHidden._data[i][j];
                }
            }
            for(let i = 0; i < child.nn._wHiddenOutput.size()[0]; i++){
                for(let j = 0; j < child.nn._wHiddenOutput.size()[1]; j++){
                    child.nn._wHiddenOutput._data[i][j] = Math.random() > .5 ? p2.nn._wHiddenOutput._data[i][j] : p1.nn._wHiddenOutput._data[i][j];
                }
            }
            delete p1.obj
            delete p2.obj;
            newPopulation.push(child);
        }
        return newPopulation;
    }

    _mutate(population) {
        for (let i = 1; i < population.length-1; i++) {
            for (let j = 0; j < population[i].nn._wInputHidden.size()[0]; j++) {
                for (let k = 0; k < population[i].nn._wInputHidden.size()[1]; k++) {
                    if (Math.random() < this.gaLr) population[i].nn._wInputHidden._data[j][k] = Math.random() * 2 - 1;
                }
            }
            for (let j = 0; j < population[i].nn._wHiddenOutput.size()[0]; j++) {
                for (let k = 0; k < population[i].nn._wHiddenOutput.size()[1]; k++) {
                    if (Math.random() < this.gaLr) population[i].nn._wHiddenOutput._data[j][k] = Math.random() * 2 - 1;
                }
            }
        }
        return population;
    }



}

class Individual {
    constructor(nnInput, nnHidden, nnOutput, nnLR, objClass, ...args) {
        this.objClass = objClass;
        this.args = args;
        this.nn = new NeuralNetwork(nnInput, nnHidden, nnOutput, nnLR);
        this.fitness = 0;
        this.obj = new objClass(this,...this.args);
    }
    setFitness(fitnessValue){
        this.fitness = fitnessValue;
    }
}

class GATest {
    constructor(individual, a, b, c) {
        this.individual = individual;
        this.a = a;
        this.b = b;
        this.c = c;
    }
    setFitness(fitnessValue){
        this.individual.setFitness(fitnessValue);
    }
}












/*
let nn2 = new NeuralNetwork(2, 3, 1, .5);


const inputs = [  [0, 0], [0, 1], [1, 0], [1, 1] ];
const results = [ [0], [1], [1], [0] ];
let canvas = document.getElementById("testCanvas");
let ctx = canvas.getContext("2d");
ctx.fillStyle = 'black';
ctx.fillRect(0,0, canvas.width, canvas.height);
//window.requestAnimationFrame(visualTest);
function visualTest(){
    for (let i = 0; i < 100; i++) {
        let index = Math.floor(Math.random() * 4);
        console.log(index);
        console.table(nn2.bp(inputs[index], results[index]));
        let a = Math.floor(Math.random()*50)/50;
        let b = Math.floor(Math.random()*50)/50;
        let c = nn2.ff([a,b]);
        ctx.fillStyle = `rgb(${c[0]*255}, ${c[0]*255}, ${c[0]*255})`;
        ctx.fillRect(a*canvas.width, b*canvas.height, canvas.width/50, canvas.height/50);
    }
    window.requestAnimationFrame(visualTest);
}
*/
