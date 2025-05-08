import React from 'react';

function Botones({ alPresionarBoton, eliminarUltimo, eliminarTodos, intentoActual, modoRepeticion }) {
    const botones = [...Array(10).keys()];

    return (
        <div>
            {botones.map((numero) => (
                <button
                    key={numero}
                    className="colorBoton"
                    onClick={() => alPresionarBoton(numero)}
                    disabled={modoRepeticion === false && intentoActual.includes(numero.toString())}
                >
                    {numero}
                </button>
            ))}
            <div>
                <button className="colorBoton" onClick={eliminarUltimo}>
                    Eliminar Último
                </button>
                <button className="colorBoton" onClick={eliminarTodos}>
                    Eliminar Todos
                </button>
            </div>
        </div>
    );
}

export default Botones;
