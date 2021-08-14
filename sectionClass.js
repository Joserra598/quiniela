import { dataColection } from "./testCurrentNumber";
import viewCl from "./viewCl";
import { sidebar } from "./elemets";
import { getDataTeams } from "./dataAllTeamsByLeage";

class sectionCl {
	titulos = new Map([
		[2, "Equipo"],
		[3, "Participante"],
	]);
	maxLimitSections = 3;
	defaultSections = 2;
	constructor() {
		sidebar.addEventListener("click", this.handleMove.bind(this));
		sidebar.addEventListener("click", this.showInfo);
	}

	handleMove(e) {
		const btnPushed = e.target.closest(".btn-primary") || e.target.closest(".back__icon");

		if (!btnPushed) return;

		btnPushed.dataset?.back && this.dismoutSection && this.dismoutSection(e, btnPushed);

		btnPushed.dataset?.next && this.renderInputs && this.renderInputs(e, btnPushed);
	}

	moveSections(val) {
		const sidebarSecions = document.querySelectorAll(".sidebar__section");
		sidebarSecions.forEach((section) => {
			section.style.transform = `translateX(${val * -100}% )`;
		});
	}

	waitTime(time) {
		return new Promise((resolve) => {
			setTimeout(resolve, time * 1000);
		});
	}

	showErrorValue(inputs) {
		inputs.forEach((input) => {
			if (!Boolean(input.value)) {
				input.classList.add("error-move");
				setTimeout(() => input.classList.remove("error-move"), 400);
			}
		});
	}

	showInfo(e) {
		const inputCatch = e.target.closest("input");
		// Remove info in all inputs
		[...e.target.closest(".sidebar__section").querySelectorAll(".input__info")].forEach((info) =>
			info.classList.remove("show-info")
		);

		if (!inputCatch) return;

		// Add Info only the input selected now
		const infoElmt = inputCatch.closest(".input__container")?.querySelector(".input__info");

		infoElmt && infoElmt.classList.add("show-info");
	}

	// Este metod regresa true si hay uno input vacio;
	checkValues(values) {
		return values.some((value) => Boolean(value.value) === false);
	}
}

class renderCl extends sectionCl {
	constructor() {
		super();
	}

	inputsCreate([{ NumeroParticipantes: cantidad }], titulo) {
		// inputsCreate(cantidad, titulo) {
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
	}

	teamsCreate(teamsArray) {
		return teamsArray
			.map((teamObj, i) => {
				const {
					team: { name, logo },
				} = teamObj;

				return `<div class="team__cotainer" data-index="${i}">
				<img src=https://media.api-sports.io/football/teams/2289.png"Team-name" />
					<h3 class="team__name">${name}</h3>
				</div>`;
			})
			.join("");
		// console.log(valores);
	}

	inputsForUser(titulo) {
		return `<div class="inputs__container">${this.inputsCreate(
			dataColection.getData(),
			titulo
		)}</div>`;
	}

	async inputsByInterfaze() {
		const data = await getDataTeams();
		this.teamsCreate(data.response);
		return `<div class="teams__container">${this.teamsCreate(data.response)}</div>`;
	}

	async sidebarSectionGeneral(titulo = "Hola", sectionNumber) {
		console.log(sectionNumber);

		let renderValues = sectionNumber == 2 ? this.inputsByInterfaze() : this.inputsForUser(titulo);

		if (typeof renderValues === "object") {
			renderValues = await renderValues;
		}

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

		    ${renderValues}
		    <button class="btn btn-primary" data-next="${sectionNumber + 1}">Siguiente</button>
		</div>`;
	}

	storedValues(inputs) {
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
	}

	getTitulo(val) {
		return this.titulos.get(val);
	}

	async rendernewSection(currentSection) {
		sidebar.insertAdjacentHTML(
			"beforeend",
			await this.sidebarSectionGeneral(this.getTitulo(currentSection), currentSection)
		);
	}

	// rendernewSection(currentSection) {
	// 	sidebar.insertAdjacentHTML(
	// 		"beforeend",
	// 		`<img class="img-flag" src="./img/2288.png" alt="contry-flag" />`
	// 	);
	// }

	handleRender(currentSection, inputs) {
		dataColection.setNewValue(this.storedValues(inputs));
		currentSection <= this.maxLimitSections ? this.rendernewSection(currentSection) : new viewCl();
	}

	async renderInputs(e, btnPushed) {
		const currentSection = +btnPushed.dataset.next;
		const inputs = [...e.target.closest(".sidebar__section").querySelectorAll("input")];
		e.preventDefault();

		this.checkValues(inputs) && this.showErrorValue(inputs);
		if (this.checkValues(inputs)) return;

		e.target.classList.add("btn__spinner");

		if (currentSection >= this.defaultSections) {
			this.handleRender(currentSection, inputs);
		}

		await this.waitTime(1);
		this.moveSections(currentSection);

		await this.waitTime(0.3);
		e.target.classList.remove("btn__spinner");
		// console.log(dataColection.getData());
	}
}

class unsucribeCl extends sectionCl {
	constructor() {
		super();
	}

	async dismoutSection(e, btnPushed) {
		this.moveSections(+btnPushed.dataset.back - 1);
		if (btnPushed.dataset.back < this.defaultSections) return;
		dataColection.removeLastValue();
		await this.waitTime(0.5);
		e.target.closest(".sidebar__section").remove();
	}
}

export { renderCl, unsucribeCl };
