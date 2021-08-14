// Cree un closure en el que almaceno los participantes elegidos.

const dataColection = (() => {
	let participantes = [];
	return {
		getData() {
			return participantes;
		},
		setNewValue(value) {
			participantes.push(value);
		},
		removeLastValue(){
			participantes.pop(); 
		}
	};
})();

export { dataColection };
