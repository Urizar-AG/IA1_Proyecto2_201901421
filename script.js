// Modelos
const lr = new LinearRegression();
let dataSet = [];
let xTrain = [];
let yTrain = [];
let graph = null;

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
            readLinearRegressionCSV(splitedContent);
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
  