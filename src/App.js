import React, { useState, useEffect } from 'react';
import './App.css';
import Botones from './componentes/Botones';
import TableroDeJuego from './componentes/TableroDeJuego';
import FormularioDeEntrada from './componentes/FormularioDeEntrada';
import Confetti from 'react-confetti';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [numeroSecreto, setNumeroSecreto] = useState('');
    const [intentoActual, setIntentoActual] = useState('');
    const [intentos, setIntentos] = useState([]);
    const [juegoTerminado, setJuegoTerminado] = useState(false);
    const [modoRepeticion, setModoRepeticion] = useState(false);
    const [mostrarConfetti, setMostrarConfetti] = useState(false);

    useEffect(() => {
        reiniciarJuego();
    }, [modoRepeticion]);

    const generarNumeroSecreto = () => {
        const digitos = [...Array(10).keys()];
        let numero = '';
    
        if (modoRepeticion) {
            while (numero.length < 4) {
                const indiceAleatorio = Math.floor(Math.random() * digitos.length);
                numero += digitos[indiceAleatorio];
            }
        } else {
            while (numero.length < 4) {
                const indiceAleatorio = Math.floor(Math.random() * digitos.length);
                numero += digitos.splice(indiceAleatorio, 1);
            }
        }
        
        return numero;
    };

    const manejarIntento = () => {
        if (intentoActual.length !== 4 || juegoTerminado) return;
    
        const resultado = evaluarIntento(intentoActual, numeroSecreto);
        setIntentos([
            ...intentos,
            {
                intento: intentos.length + 1,
                valor: intentoActual,
                resultado,
            },
        ]);
        setIntentoActual('');

        if (resultado.correctos === 4) {
            setJuegoTerminado(true);
            setMostrarConfetti(true);
        } else if (intentos.length >= 9) {
            setJuegoTerminado(true);
            toast.error("¡Perdiste! El número secreto era: " + numeroSecreto);
        }
    };

    function evaluarIntento(intent, numeroSecreto) {
        const intento = intent.split('');
        const secreto = numeroSecreto.split('');
        const usadoSecreto = Array(secreto.length).fill(false);
        const usadoIntento = Array(intento.length).fill(false);
    
        let correctos = 0;
        let regulares = 0;
    
        for (let i = 0; i < intento.length; i++) {
            if (intento[i] === secreto[i]) {
                correctos++;
                usadoSecreto[i] = true;
                usadoIntento[i] = true;
            }
        }

        for (let i = 0; i < intento.length; i++) {
            if (!usadoIntento[i]) {
                for (let j = 0; j < secreto.length; j++) {
                    if (!usadoSecreto[j] && intento[i] === secreto[j]) {
                        regulares++;
                        usadoSecreto[j] = true;
                        break;
                    }
                }
            }
        }

        const incorrectos = intento.length - (correctos + regulares);

        return {
            correctos,
            regulares,
            incorrectos,
        };
    }

    const manejarPresionBoton = (numero) => {
        if (intentoActual.length < 4 && (modoRepeticion || !intentoActual.includes(numero))) {
            setIntentoActual(intentoActual + numero);
        }
    };

    const eliminarUltimo = () => {
        setIntentoActual(intentoActual.slice(0, -1));
    };

    const eliminarTodos = () => {
        setIntentoActual('');
    };

    const reiniciarJuego = () => {
        setNumeroSecreto(generarNumeroSecreto());
        setIntentoActual('');
        setIntentos([]);
        setJuegoTerminado(false);
        setMostrarConfetti(false);
    };

    const terminarJuego = () => {
        setJuegoTerminado(true);
        setMostrarConfetti(false);
        toast.info("Juego Terminado");
    };

    const cambiarModo = (modo) => {
        setModoRepeticion(modo);
    };


    const ganarDirectamente = () => {
        setJuegoTerminado(true);
        setMostrarConfetti(true);
        toast.success("¡Ganaste! El número secreto era: " + numeroSecreto);
    };

    return (
        <div>
            <div>
                <h1>Adivina El Número</h1>
                <h3>Cómo Jugar</h3>
                <ul>
                    <li>1. Elige un número de 4 cifras.</li>
                    <li>2. Adivina el número en 10 intentos.</li>
                    <li>3. Recibirás pistas sobre cuántos números están en la posición correcta, cuántos están en una posición diferente y cuántos no están en el número.</li>
                    <li>4. Si adivinas el número en menos de 10 intentos, ¡ganas!</li>
                    <li>5. Las pistas son =
                                        *correctos(Numero en la posicion correcta) 
                                        *regulares(Numero en la posicion incorrecta) 
                                        *incorrectos(El numero no esta en el numero secreto) </li>


                </ul>
            </div>

            <div>
                <FormularioDeEntrada intentoActual={intentoActual} />
                <div>
                    <button onClick={() => cambiarModo(true)} disabled={modoRepeticion}>Modo Repetición</button>
                    <button onClick={() => cambiarModo(false)} disabled={!modoRepeticion}>Modo Sin Repetición</button>
                </div>
                <div>
                    <h2>Número Secreto: {juegoTerminado ? numeroSecreto : 'XXXX'}</h2>
                </div>
                <Botones
                    alPresionarBoton={manejarPresionBoton}
                    eliminarUltimo={eliminarUltimo}
                    eliminarTodos={eliminarTodos}
                    intentoActual={intentoActual}
                    modoRepeticion={modoRepeticion}
                />
                <button onClick={manejarIntento} disabled={intentoActual.length !== 4}>
                    Enviar Intento
                </button>
                <TableroDeJuego intentos={intentos} />
                <button onClick={reiniciarJuego}>Reiniciar Juego</button>
                <button onClick={terminarJuego}>Terminar Juego</button>
                <button onClick={ganarDirectamente}>Ganar Directamente</button>
            </div>

            {mostrarConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
            <ToastContainer />
        </div>
    );
}

export default App;