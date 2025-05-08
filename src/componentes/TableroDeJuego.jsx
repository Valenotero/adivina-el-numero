import React from 'react';

export default function TableroDeJuego({ intentos }) {
    return (
        <div>
            <h2>Historial de Intentos</h2>
            <ul>
                {intentos.map((item, index) => (
                    <li key={index}>
                        {index + 1} - {item.valor} -{' '}
                        <span className="correctos">Correctos:</span> {item.resultado.correctos},{' '}
                        <span className="regulares">Regulares:</span> {item.resultado.regulares},{' '}
                        <span className="incorrectos">Incorrectos:</span> {item.resultado.incorrectos}
                    </li>
                ))}
            </ul>
        </div>
    );
}
