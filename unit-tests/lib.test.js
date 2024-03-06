import {describe, it, expect} from 'vitest';
import {NeuralNetwork, GeneticAlgorithm, Individual} from '../lib/simple';


class Test {
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
describe('NeuralNetwork', () => {
    let a = new NeuralNetwork(2, 2, 1, 0.1);
    it('should create a new NeuralNetwork', () => {
        expect(a).toBeDefined();
    });
    describe('_activation', () => {
        it('should have a activation method', () => {
            expect(a._activation).toBeDefined();
        });
        it('should return result of sigmoid function', () => {
            expect(a._activation(0.7)).toBeCloseTo(0.66818777, 7);
        });
    });
    describe('_dActivation', () => {
        it('should have a dActivation method', () => {
            expect(a._dActivation).toBeDefined();
        });
        it('should return result of sigmoid derivative function', () => {
            expect(a._dActivation(0.7)).toBeCloseTo(0.21000000, 7);
        });
    });
    describe('ff', () => {
        it('should have a ff method', () => {
            expect(a.ff).toBeDefined();
        });
        it('should return result of feedforward', () => {
            a._wInputHidden._data = [[0.1,0.2,0.3],[-0.5,0.7,-0.1]];
            a._wHiddenOutput._data = [[-0.3,0.5,-0.7]];
            expect(a.ff([100,2])[0]).toBeCloseTo(0.2689427511232424, 15);
        });
    });
    describe('bp', () => {
        it('should have a bp method', () => {
            expect(a.bp).toBeDefined();
        });
        it('should return result of backpropagation', () => {
            a._wInputHidden._data = [[0.1,0.2,0.3],[-0.5,0.7,-0.1]];
            a._wHiddenOutput._data = [[-0.3,0.5,-0.7]];
            for (let i = 0; i < 1000; i++) {
                a.bp([3,2], [0.0001]);
            }
            expect(a._wInputHidden._data[0][0]).toBeCloseTo(0.3963851910009061, 15);
            expect(a._wInputHidden._data[1][1]).toBeCloseTo(0.5528744074836439, 15);
            expect(a._wHiddenOutput._data[0][0]).toBeCloseTo(-1.2034113547016951, 15);
        });
    });
});
describe('GeneticAlgorithm', () => {
    let a = new GeneticAlgorithm(10, 2,2,1,0.1, Test, 3,5,7);
    it('should create a new GeneticAlgorithm', () => {
        expect(a).toBeDefined();
    });
    describe('setThreshold', () => {
        it('should have a setThreshold method', () => {
            expect(a.setThreshold).toBeDefined();
        });
        it('should set the threshold', () => {
            a.setThreshold(0.7);
            expect(a.threshold).toBe(0.7);
        });
    });
    describe('setLr', () => {
        it('should have a setLr method', () => {
            expect(a.setLr).toBeDefined();
        });
        it('should set the learning rate', () => {
            a.setLr(0.2);
            expect(a.gaLr).toBe(0.2);
        });
    });
    describe('get', () => {
        it('should have a get method', () => {
            expect(a.get).toBeDefined();
        });
        it('should return the population', () => {

            expect(a.get(1)).toBe(a.population[1].obj);
        });
    });
    describe('getFittest', () => {
        it('should have a getFittest method', () => {
            expect(a.getFittest).toBeDefined();
        });
        it('should return the fittest individual', () => {
            a.population[3].setFitness(10);
            expect(a.getFittest()).toBe(a.population[3]);
        });
    });
    describe('forEach', () => {
        it('should have a forEach method', () => {
            expect(a.forEach).toBeDefined();
        });
        it('should iterate through the population', () => {
            let count = 0;
            a.forEach((individual) => {
                count++;
                individual.setFitness(count);
            });
            expect(count).toBe(10);
            expect(a.population[2].fitness).toBe(3);
            expect(a.population[5].fitness).toBe(6);
        });
    });
    describe('evolve', () => {
        it('should have a evolve method', () => {
            expect(a.evolve).toBeDefined();
        });
        it('should change population size', () => {
            a.population[3].setFitness(10);
            a.population[5].setFitness(10);
            a.evolve(5);
            expect(a.population.length).toBe(5);
        });
        it('should change population', () => {
            a.population[3].setFitness(10);
            a.population[4].setFitness(10);
            a.population[0].setFitness(0);
            let num = a.population[0].nn._wInputHidden._data[0][0];
            a.evolve(5);
            expect(a.population[0].nn._wInputHidden._data[0][0]).not.toBe(num);
        });
    });
    describe('_selection', () => {
        it('should have a _selection method', () => {
            expect(a._selection).toBeDefined();
        });
    });
    describe('_crossover', () => {
        it('should have a _crossover method', () => {
            expect(a._crossover).toBeDefined();
        });
    });
    describe('_mutate', () => {
        it('should have a _mutate method', () => {
            expect(a._mutate).toBeDefined();
        });
    });
});

describe('Individual', () => {
    let a = new Individual(2,2,1,0.1, Test, 3,5,7);
    it('should create a new Individual', () => {
        expect(a).toBeDefined();
    });
    describe('setFitness', () => {
        it('should have a setFitness method', () => {
            expect(a.setFitness).toBeDefined();
        });
        it('should set the fitness', () => {
            a.setFitness(0.7);
            expect(a.fitness).toBe(0.7);
        });
    });
    describe('getFitness', () => {
        it('should have a getFitness method', () => {
            expect(a.getFitness).toBeDefined();
        });
        it('should return the fitness', () => {
            a.setFitness(0.7);
            expect(a.getFitness()).toBe(0.7);
        });
    });
    describe('getObj', () => {
        it('should have a getObj method', () => {
            expect(a.getObj).toBeDefined();
        });
        it('should return the obj', () => {
            expect(a.getObj()).toBe(a.obj);
        });
    });
    describe('setObj', () => {
        it('should have a setObj method', () => {
            expect(a.setObj).toBeDefined();
        });
        it('should set the obj', () => {
            a.setObj(0.7);
            expect(a.obj).toBe(0.7);
        });
    });
});

