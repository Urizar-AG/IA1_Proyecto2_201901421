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
