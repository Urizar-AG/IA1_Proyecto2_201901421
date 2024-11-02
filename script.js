// Modelos
const lr = new LinearRegression();
const pr = new PolynomialRegression();
let dataSet = [];
let xTrain = [];
let yTrain = [];
let xToPredict = [];
let degree = 2;
let graph = null;

document.getElementById('model').addEventListener('change', () => {
    const model = document.getElementById('model').value;
    if (model === 'lr') {
        document.getElementById('lr-parameters').style.display = 'flex';
        document.getElementById('lr-result').style.display = 'flex';
        document.getElementById('pr-parameters').style.display = 'none';  
        document.getElementById('pr-result').style.display = 'none';  
    }else if(model === 'pr') {
        document.getElementById('lr-parameters').style.display = 'none';
        document.getElementById('lr-result').style.display = 'none';
        document.getElementById('pr-parameters').style.display = 'flex';  
        document.getElementById('pr-result').style.display = 'flex';
    }
});

// Entrenamiento
document.getElementById('train').addEventListener('click', () => {
    const model = document.getElementById('model').value;
    
    if (model === 'lr') {
        const x = document.getElementById('xtrain').value;
        const y = document.getElementById('ytrain').value;
        
        // Carga la data y entrena el modelo
        xTrain = dataSet[x];
        yTrain = dataSet[y];
        lr.fit(xTrain, yTrain);
    }else if(model === 'pr') {
        const x = Number(document.getElementById('xtrain-pr').value);
        const y = Number(document.getElementById('ytrain-pr').value);
        const xpr = Number(document.getElementById('xtopredict-pr').value);
        degree = Number(document.getElementById('degree-pr').value);
        xTrain = dataSet[x];
        yTrain = dataSet[y];
        xToPredict = dataSet[xpr];
        pr.fit(xTrain, yTrain, degree);
    }
    alert('Modelo entrenado');
});

// Predicciones
document.getElementById('predict').addEventListener('click', () => {
    const model = document.getElementById('model').value;
    if (model === 'lr') {
        yPredict = lr.predict(xTrain);
        document.getElementById('ypredict').textContent = yPredict;
        graphLinearRegression(yPredict);
    }else if(model === 'pr') {
        const yPredictionDegree = pr.predict(xToPredict);
        document.getElementById('ypredictiondegree').textContent = yPredictionDegree;
        graphPolynomialRegression(yPredictionDegree);
    }
});

// Leer el archivo CSV
document.getElementById('filepicker').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const fr = new FileReader();
        fr.onload = function(event) {
            const content = event.target.result;
            const splitedContent = content.split('\n');
            splitedContent.pop();
            const model = document.getElementById('model').value;
            if (model === 'lr') {
                readLinearRegressionCSV(splitedContent);
            }else if(model === 'pr') {
                readPolynomialRegressionCSV(splitedContent);
            }
        };
        fr.readAsText(file);
    }
});

// Carga al dataSet - Regresión lineal
function readLinearRegressionCSV(data) {
    const col1 = [];
    const col2 = [];
    for (let i = 1; i < data.length; i++) {
        col1.push(Number(data[i].split(';')[0]));
        col2.push(Number(data[i].split(';')[1]));
    }
    dataSet = [col1, col2];
}

// Graficar regresión lineal
function graphLinearRegression(yPredict) {
    const dataset1 = {
        label: "yTrain",
        data: yTrain.map((y, i) => ({ x: i + 1, y })),
        backgroundColor: 'rgb(25, 113, 194)',
        fill: false,
        pointRadius: 4,
        tension: 0.1,
        type: 'scatter'
    };
    
    const dataset2 = {
        label: "yPredict",
        data: yPredict.map((y, i) => ({ x: i + 1, y })),
        borderColor: 'rgb(189, 52, 255)',
        backgroundColor: 'rgb(189, 52, 255)',
        fill: false,
        pointRadius: 4,
        tension: 0.1,
        type: 'line'
    };

    const data = {
        datasets: [dataset1, dataset2]
    };
    
    // Ajustes de la gráfica
    const config = {
        type: 'scatter',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                },
            }
        }
    };
    
    if (graph) {
        graph.destroy();
    }
    graph = new Chart(document.getElementById('linear-regression-graph'), config);
}  
  
// Carga al dataset - Regresión Polinomial
function readPolynomialRegressionCSV(data) {
    const col1 = [];
    const col2 = [];
    const col3 = [];
    for (let i = 1; i < data.length; i++) {
        col1.push(Number(data[i].split(';')[0]));
        col2.push(Number(data[i].split(';')[1]));
        col3.push(Number(data[i].split(';')[2]));
    }
    dataSet = [col1, col2, col3];
}

// Graficar regresión polinomial
function graphPolynomialRegression(yPredictionDegree) {
    const dataset1 = {
        label: "yTrain",
        data: yTrain.map((y, i) => ({ x: i + 1, y })),
        backgroundColor: 'rgb(25, 113, 194)',
        fill: false,
        pointRadius: 4,
        tension: 0.1,
        type: 'scatter'
    };
    
    const dataset2 = {
        label: "yPredict",
        data: yPredictionDegree.map((y, i) => ({ x: i + 1, y })),
        borderColor: 'rgb(189, 52, 255)',
        backgroundColor: 'rgb(189, 52, 255)',
        fill: false,
        pointRadius: 4,
        tension: 0.1,
        type: 'line'
    };

    const data = {
        datasets: [dataset1, dataset2]
    };
    
    // Ajustes de la gráfica
    const config = {
        type: 'scatter',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                },
            }
        }
    };
    
    if (graph) {
        graph.destroy();
    }
    graph = new Chart(document.getElementById('polynomial-regression-graph'), config);
}  
  