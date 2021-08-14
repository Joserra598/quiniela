import { dataColection } from "./testCurrentNumber";
import { sidebar, overlay, view } from "./elemets";

const btnEdit = document.querySelector("#editBtn");
const btnMix = document.querySelector("#mixBtn");

class viewCl {
	constructor(inputs) {
		this.showValues();
		btnEdit.addEventListener("click", this.editValues);
		btnMix.addEventListener("click", this.mixValues);
	}

	waitTime(time) {
		return new Promise((resolve) => {
			setTimeout(resolve, time * 1000);
		});
	}

	mixValues() {
		const [, equipos, participantes] = dataColection.getData();
		const teams = Object.values(equipos);
		const players = Object.values(participantes);
		const valores = teams.map((val) => [
			val,
			...players.splice(Math.round(Math.random() * players.length - 1), 1),
		]);
		console.log(valores);
	}

	async showValues() {
		view.insertAdjacentHTML("beforeend", `<div class="spinner center"></div>`);
		sidebar.style.transform = "translateX(-100%)";
		await this.waitTime(1);
		view.querySelector(".spinner").remove();

		overlay.classList.add("hidden");
		this.renderValues();
	}

	renderValues() {
		[...view.querySelectorAll(".view__container")].forEach((section, i) => {
			section.insertAdjacentHTML("beforeend", this.getValues(i));
		});
	}

	getValues(i) {
		return Object.values(dataColection.getData()[i + 1])
			.map((elt) => `<div class="tag-value">${elt}</div>`)
			.join("");
	}
}

export default viewCl;
