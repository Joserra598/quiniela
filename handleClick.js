import { dataColection } from "./testCurrentNumber";

// const sidebarSecions = document.querySelectorAll(".sidebar__section");
const inputFirstSection = document.querySelector(".second");
const sidebar = document.querySelector(".sidebar");
// const enterForm = document.querySelector("#enterForm");

// console.log(totalParicipantes.setParticipantes(5));
// voy a usar un array temporal para guardar los datos.
let inputsValues = [];

// Esta funcion sirve para que oculte el texto de información una vez que ya no esta en focus.

const showInfo = (e) => {
	// console.log(e.target.closest("input"));
	const inputCatch = e.target.closest("input");
	if (!inputCatch) return;

	// Remove info in all inputs
	const InputContainer = inputCatch.closest(".sidebar__section").querySelectorAll(".input__info");
	const infoArray = [...InputContainer];
	infoArray.forEach((info) => info.classList.remove("show-info"));

	// Add Info only the input selected now
	const infoElmt = inputCatch.closest(".input__container").querySelector(".input__info");
	infoElmt.classList.add("show-info");
};

const moveSections = (val) => {
	const sidebarSecions = document.querySelectorAll(".sidebar__section");
	sidebarSecions.forEach((section) => {
		section.style.transform = `translateX(${val * -100}% )`;
	});
};

const waitTime = (time) => {
	return new Promise((resolve) => {
		setTimeout(resolve, time * 1000);
	});
};

const inputsCreate = ([{ NumeroParticipantes: cantidad }], titulo) => {
	// Regreso un string para colocar unir al String padre
	return new Array(+cantidad)
		.fill("")
		.map(
			(_, pos) =>
				`<div class="input__values">
				<label for="" class="input__label">${titulo}  #${pos + 1}:</label>
				<input type="text" class="input__primary" />
			</div>`
		)
		.reduce((acc, val) => (acc += val), "");
};

const sidebarSectionGeneral = (titulo = "Hola", sectionNumber) => {
	return `<div class="sidebar__section user-input" style="transform: translateX(-${
		(sectionNumber - 1) * 100
	}%);">
	<div class="sidebar__section-header">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			class="back__icon"
			data-back="${sectionNumber}"
		>
			<path
				d="M13.427 3.021h-7.427v-3.021l-6 5.39 6 5.61v-3h7.427c3.071 0 5.561 2.356 5.561 5.427 0 3.071-2.489 5.573-5.561 5.573h-7.427v5h7.427c5.84 0 10.573-4.734 10.573-10.573s-4.733-10.406-10.573-10.406z"
			/>
		</svg>
		<h2 class="header__title">Coloque el nombre de los ${titulo}s</h2>
	</div>
	<div class="inputs__container">${inputsCreate(inputsValues, titulo)}</div>
	<button class="btn btn-primary" data-next="${sectionNumber + 1}">Siguiente</button>
</div>
	
	`;
};

// this function return true if some input has no value.
const checkValues = (values) => values.some((value) => Boolean(value.value) === false);

const showErrorValue = (inputs) => {
	inputs.forEach((input) => {
		if (!Boolean(input.value)) {
			input.classList.add("error-move");
			setTimeout(() => input.classList.remove("error-move"), 400);
		}
	});
};

const storedValues = (inputs) => {
	return Object.fromEntries(
		inputs.map((input) => {
			const keyName = input
				.closest(".input__values")
				.querySelector("label")
				.textContent.split(" ")
				.join("")
				.slice(0, -1);
			return [keyName, input.value];
		})
	);
};

const getTitulo = (val) => {
	if (val === 2) return "Equipo";
	if (val === 3) return "Participante";
};

const renderInputs = async (e, btnPushed) => {
	const currentSection = +btnPushed.dataset.next;
	const inputs = [...e.target.closest(".sidebar__section").querySelectorAll("input")];
	e.preventDefault();
	// Si algun input no esta lleno se muestra un error.
	checkValues(inputs) && showErrorValue(inputs);

	// Si todos los values estan llenos se avanza.
	if (checkValues(inputs)) return;

	console.log(getTitulo(currentSection));

	// Cuando los values son correctos se renderizan los proximos inputs

	if (currentSection > 3) return;
	e.target.classList.add("btn__spinner");
	if (currentSection >= 2) {
		// Se deben guardar los datos antes de avanzar.
		inputsValues.push(storedValues(inputs));
		sidebar.insertAdjacentHTML(
			"beforeend",
			sidebarSectionGeneral(getTitulo(currentSection), currentSection)
		);
	}
	await waitTime(1);
	moveSections(currentSection);

	await waitTime(0.3);
	e.target.classList.remove("btn__spinner");
};

const dismoutSection = async (e, btnPushed) => {
	moveSections(+btnPushed.dataset.back - 1);
	if (btnPushed.dataset.back < 2) return;
	inputsValues.pop();
	await waitTime(0.5);
	e.target.closest(".sidebar__section").remove();
};

const handleMove = (e) => {
	const btnPushed = e.target.closest(".btn-primary") || e.target.closest(".back__icon");

	if (!btnPushed) return;

	btnPushed.dataset?.back && dismoutSection(e, btnPushed);
	btnPushed.dataset?.next && renderInputs(e, btnPushed);
};

inputFirstSection.addEventListener("click", showInfo);
sidebar.addEventListener("click", handleMove);
// enterForm.addEventListener("submit", checkValues);

export { showInfo, handleMove };
