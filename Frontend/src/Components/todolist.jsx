import { useState } from 'react';

function TodoList() {

// État pour stocker ce qui est tapé par l'utilisateur
const [inputValue, setInputValue] = useState('');

// État pour stocker la liste des tâches
const [tasks, setTasks] = useState(["Exemple de tâche 1", "Exemple de tâche 2"]);

const addTask = () => {
    if (inputValue.trim() === "")return;
    // l'input est vide 

    // 2) Mettre à jour la liste des tâches
    setTasks([...tasks, inputValue.trim()]);
    // 3) Vider l'input
    setInputValue("");
}

return (
<div classname="todo-container">
    <h2>Ma liste detâches</h2>
    {/* un formulaire et la liste des taches*/}
    <div className="input-group">
        <input
            value={inputValue}
            onChange={(e) => {setInputValue(e.target.value);}}
            type="text"
            placeholder="Ajouter une nouvelle tâche"/>
            <button onClick={addTask}>Ajouter</button>

    </div>
    <ul className="task-list">
        {tasks.map((task, index) => (
            <li key={index}>{task}</li>
        ))}
    </ul>
</div> 
);
}
export default TodoList;