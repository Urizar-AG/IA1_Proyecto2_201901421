class LinearModel {
    constructor() {
        this.isFit = false
    }
}

class LinearRegression extends LinearModel {
    constructor() {
        super()
        this.m = 0
        this.b = 0
    }

    fit(xTrain, yTrain) {
        var sumX = 0
        var sumY = 0
        var sumXY = 0
        var sumXX = 0

        //Se agrego la validación de que los datos de entrenamiento sean de la misma longitud. 
        if (xTrain.length != yTrain.length) {
            throw new Error('Los parametros para entrenar no tienen la misma longitud!');
        }

        //Validación ya que no se cuenta con manejo de errores en caso se llegara a implementar.
        if (xTrain.length === 0) {
            return [ [], [] ];
        }

        for(var i = 0; i < xTrain.length; i++) {
            sumX += xTrain[i]
            sumY += yTrain[i]
            sumXY += xTrain[i] * yTrain[i]
            sumXX += xTrain[i] * xTrain[i]
        }
        this.m = (xTrain.length * sumXY - sumX * sumY) / (xTrain.length * sumXX - Math.pow(Math.abs(sumX), 2))
        this.b = (sumY * sumXX - sumX * sumXY) / (xTrain.length * sumXX - Math.pow(Math.abs(sumX), 2))        
        this.isFit = true
    }

    predict(xTest) {
        var yPredict = []
        if (this.isFit) {
            for(var i = 0; i < xTest.length; i++) {
                yPredict.push(this.m * xTest[i] + this.b)
            }            
        }
        return yPredict
    }

    mserror(yTrain, yPredict) {
        var mse = 0
        for(var i = 0; i < yTrain.length; i++) {
            mse += Math.pow(yTrain[i]-yPredict[i],2)
        }
        return mse / yTrain.length
    }

    coeficientR2(yTrain, yPredict) 
    {
        var avg=0;
        var numerator = 0;
        var denominator = 0;
        for(var i = 0; i < yTrain.length; i++) {
            avg += yTrain[i]
        }
        avg=avg/yTrain.length;
        for(var i = 0; i < yPredict.length; i++) {
            numerator += Math.pow(yPredict[i]-avg,2);
        }
        for(var i = 0; i < yTrain.length; i++) {
            denominator += Math.pow(yTrain[i]-avg,2);
        }
        return numerator/denominator
    }
}   
    
class PolynomialModel {
    //Polinomial model that will be inherited by Polynomial Regression
    constructor() {
        this.isFit = false;
    }
}

class PolynomialRegression extends PolynomialModel {
    //PolynomialRegression code
    constructor() {
        super();
        this.solutions = [];
        this.error = 0;
    }

    //Method that trains the model in order to create the regression
    fit(xArray, yArray, degree) {
        //Equation matrix size based on the degree and number of elements
        let equationSize = degree + 1;
        let nElements = degree + 2;

        //Equation matrix to be solved
        let equations = new Array(equationSize);
        for (let i = 0; i < equationSize; i++) {
            equations[i] = new Array(nElements);
        }

        //Building equation matrix
        for (let i = 0; i < equationSize; i++) {
            for (let j = 0; j < nElements; j++) {
                let sum = 0;
                if (i == 0 && j == 0) {
                    sum = xArray.length;
                }
                else if (j == nElements - 1) {
                    for (let k = 0; k < xArray.length; k++) {
                        sum += Math.pow(xArray[k], i) * yArray[k];
                    }
                }
                else {
                    for (let k = 0; k < xArray.length; k++) {
                        sum += Math.pow(xArray[k], (j + i));
                    }
                }
                equations[i][j] = sum;
            }
        }

        //Staggering matrix
        for (let i = 1; i < equationSize; i++) {
            for (let j = 0; j <= i - 1; j++) {
                let factor = equations[i][j] / equations[j][j];
                for (let k = j; k < nElements; k++) {
                    equations[i][k] = equations[i][k] - factor * equations[j][k];
                }
            }
        }

        //Solving matrix
        for (let i = equationSize - 1; i > -1; i--) {
            for (let j = equationSize - 1; j > -1; j--) {
                if (i == j) {
                    equations[i][nElements - 1] = equations[i][nElements - 1] / equations[i][j];
                }
                else if (equations[i][j] != 0) {
                    equations[i][nElements - 1] -= equations[i][j] * equations[j][nElements - 1];
                }
            }
        }

        //Storing solutions
        this.solutions = new Array(equationSize);
        for (let i = 0; i < equationSize; i++) {
            this.solutions[i] = equations[i][nElements - 1];
        }

        //Setting Model as trained
        this.isFit = true;

        //Setting error
        this.calculateR2(xArray, yArray);
    }

    //Function that creates a prediction based in the regression model
    predict(xArray) {
        let yArray = [];
        //Checking if the model is already trained
        if (this.isFit) {
            //Generating the predictions based in the input and solutions
            for (let i = 0; i < xArray.length; i++) {
                let yprediction = 0;
                for (let j = 0; j < this.solutions.length; j++) {
                    yprediction += this.solutions[j] * Math.pow(xArray[i], j);
                }
                yArray.push(yprediction);
            }
        }

        //Returning Prediction
        return yArray;
    }

    //Method that stores error for the trained array
    calculateR2(xArray, yArray) {
        //Setting error array and predictions
        let errors = new Array(xArray.length);
        let prediction = this.predict(xArray);
        let sumY = 0;

        //Calculating errors
        for (let i = 0; i < xArray.length; i++) {
            sumY += yArray[i];
            errors[i] = Math.pow(yArray[i] - prediction[i], 2);
        }

        let sr = 0;
        let st = 0;
        for (let i = 0; i < xArray.length; i++) {
            sr += errors[i];
            st += Math.pow(yArray[i] - (sumY / xArray.length), 2);
        }
        let r2 = (st - sr) / st;
        this.error = r2;
    }

    getError() {
        return this.error;
    }
}  

class Matriz {

    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;

        this.data = [];
        for (let i = 0; i < this.rows; i++) {
            this.data[i] = [];
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] = 0;
        }


    }

    // http://github.com/AlexDenver

    static multiplicar(m1, m2) {

        if (m1.cols !== m2.rows) {
            console.log("Cannot Operate, Check Matriz Multiplication Rules.");
            return undefined;
        } else {
            let result = new Matriz(m1.rows, m2.cols);

            for (let i = 0; i < result.rows; i++)
                for (let j = 0; j < result.cols; j++) {
                    let sum = 0;
                    for (let k = 0; k < m1.cols; k++) {
                        sum += m1.data[i][k] * m2.data[k][j];
                    }
                    result.data[i][j] = sum;
                }
            return result;

        }
    }
    multiplicar(n) {
        if (n instanceof Matriz) {

            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] *= n.data[i][j];

        } else {
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] *= n;
        }
    }

    summar(n) {
        if (n instanceof Matriz) {
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] += n.data[i][j];
        } else {
            for (let i = 0; i < this.rows; i++)
                for (let j = 0; j < this.cols; j++)
                    this.data[i][j] += n;
        }

    }

    static resstar(a, b) {
        let res = new Matriz(a.rows, a.cols);
        for (let i = 0; i < a.rows; i++)
            for (let j = 0; j < a.cols; j++)
                res.data[i][j] = a.data[i][j] - b.data[i][j];
        return res;
    }

    mapear(func) {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++) {
                let val = this.data[i][j];
                this.data[i][j] = func(val);
            }
    }

    static mapear(m, func) {
        for (let i = 0; i < m.rows; i++)
            for (let j = 0; j < m.cols; j++) {
                let val = m.data[i][j];
                m.data[i][j] = func(val);
            }
        return m;
    }

    tirar_random() {
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                this.data[i][j] = (Math.random() * 2) - 1;  //between -1 and 1
    }

    static transpuesta(m) {
        let res = new Matriz(m.cols, m.rows);
        for (let i = 0; i < m.rows; i++)
            for (let j = 0; j < m.cols; j++)
                res.data[j][i] = m.data[i][j];
        return res;
    }

    imprimir() {
        console.table(this.data);
    }

    convert_to_array() {
        let arr = [];
        for (let i = 0; i < this.rows; i++)
            for (let j = 0; j < this.cols; j++)
                arr.push(this.data[i][j]);
        return arr;
    }

    static get_array(array) {
        let m = new Matriz(array.length, 1);
        for (let i = 0; i < array.length; i++) {
            m.data[i][0] = array[i];
        }
        // m.print();
        return m;
    }


}


class LayerLink {

    constructor(prevNode_count, node_count) {
        this.weights = new Matriz(node_count, prevNode_count);
        this.bias = new Matriz(node_count, 1);
        this.weights.tirar_random();
        this.bias.tirar_random();

        //http://github.com/AlexDenver

        //console.table(this.weights.data)
        //console.table(this.bias.data)
    }

    actualizar_Weights(weights) {
        this.weights = weights;
    }
    obtener_Weights() {
        return this.weights;
    }
    obtener_Bias() {
        return this.bias;
    }
    summar(deltaWeight, bias) {
        this.weights.summar(deltaWeight);
        this.bias.summar(bias);
    }

}

class NeuralNetwork {

    //http://github.com/AlexDenver

    constructor(layers, options) {
        if (layers.length < 2) {
            console.error("Neural Network Needs Atleast 2 Layers To Work.");
            return { layers: layers };
        }
        this.options = {
            activation: function (x) {
                return (1 / (1 + Math.exp(-x)));
            },
            derivative: function (y) {
                return (y * (1 - y));
            }
        }
        this.learning_rate = 0.1;
        if (options) {
            if (options.learning_rate)
                this.Set_aprendizaje_rate(parseFloat(options.learning_rate));
            if (options.activation && options.derivative &&
                options.activation instanceof Function &&
                options.derivative instanceof Function) {
                this.options.activation = options.activation;
                this.options.derivative = options.derivative;
            } else {
                console.error("Check Documentation to Learn How To Set Custom Activation Function");
                console.warn("Documentation Link: http://github.com/AlexDenver")
                return { options: options };
            }
        }
        this.layerCount = layers.length - 1;   // Ignoring Output Layer.
        this.inputs = layers[0];
        this.output_nodes = layers[layers.length - 1];
        this.layerLink = [];
        for (let i = 1, j = 0; j < (this.layerCount); i++, j++) {
            if (layers[i] <= 0) {
                console.error("A Layer Needs To Have Atleast One Node (Neuron).");
                return { layers: layers };
            }
            this.layerLink[j] = new LayerLink(layers[j], layers[i]);    // Previous Layer Nodes & Current Layer Nodes
        }

    }

    Predecir(input_array) {

        if (input_array.length !== this.inputs) {
            console.error(`This Instance of NeuralNetwork Expects ${this.inputs} Inputs, ${input_array.length} Provided.`);
            return { inputs: input_array };
        }
        let input = Matriz.get_array(input_array);
        let layerResult = input;
        for (let i = 0; i < this.layerCount; i++) {
            layerResult = Matriz.multiplicar(this.layerLink[i].obtener_Weights(), layerResult);
            layerResult.summar(this.layerLink[i].obtener_Bias());
            layerResult.mapear(this.options.activation);
        }
        // The Last Layer Result will be the Final Output.
        return layerResult.convert_to_array();
    }

    Set_aprendizaje_rate(n) {
        if (n > 1 && n < 100) {
            n = n / 100;
        } else {
            console.error("Set Learning Rate Between (0 - 1) or (1 - 100)");
            return;
        }
        if (n > 0.3) {
            console.warn("It is recommended to Set Lower Learning Rates");
        }
        this.learning_rate = n;
    }

    Entrenar(input_array, target_array) {
        if (input_array.length !== this.inputs) {
            console.error(`This Instance of NeuralNetwork Expects ${this.inputs} Inputs, ${input_array.length} Provided.`);
            return { inputs: input_array };
        }
        if (target_array.length !== this.output_nodes) {
            console.error(`This Instance of NeuralNetwork Expects ${this.output_nodes} Outputs, ${target_array.length} Provided.`);
            return { outputs: target_array };
        }
        let input = Matriz.get_array(input_array);
        // Array to Store/Track each Layer Weighted Result (sum)
        let layerResult = [];
        layerResult[0] = input;  // Since input is First Layer.
        // Predicting the Result for Given Input, Store Output of each Consequent layer
        for (let i = 0; i < this.layerCount; i++) {
            layerResult[i + 1] = Matriz.multiplicar(this.layerLink[i].obtener_Weights(), layerResult[i]);
            layerResult[i + 1].summar(this.layerLink[i].obtener_Bias());
            layerResult[i + 1].mapear(this.options.activation);
        }

        let targets = Matriz.get_array(target_array);
        // Variables to Store Errors and Gradients at each Layer.
        let layerErrors = [];
        let gradients = [];

        // Calculate Actual Error based on Target.
        layerErrors[this.layerCount] = Matriz.resstar(targets, layerResult[this.layerCount]);

        // Correcting and Recalculating Error for each Layer
        for (let i = this.layerCount; i > 0; i--) {
            // Calculate the Layer Gradient 
            // dyE/dyW = learning_rate * layerError * sigmoid(x) * (1-sigmoid(x)); 
            // NOTE: dsigmoid = sigmoid(x) * (1-sigmoid(x) ie derivative of sigmoid

            gradients[i] = Matriz.mapear(layerResult[i], this.options.derivative);
            gradients[i].multiplicar(layerErrors[i]);
            gradients[i].multiplicar(this.learning_rate);

            // Calculate the Changes to be made to the weighs
            let hidden_T = Matriz.transpuesta(layerResult[i - 1]);
            let weight_ho_deltas = Matriz.multiplicar(gradients[i], hidden_T);

            // Update the Weights and Gradient According to Deltas & Gradient.
            this.layerLink[i - 1].summar(weight_ho_deltas, gradients[i]);

            // Calculate the Previous Layer Errors (Proportional Error based on Current Layer Error.)
            // NOTE: We are Backpropogating, Therefore we are going backwards 1 step (i.e. i-1)
            layerErrors[i - 1] = Matriz.multiplicar(Matriz.transpuesta(this.layerLink[i - 1].obtener_Weights()), layerErrors[i]);
        }

    }

}
