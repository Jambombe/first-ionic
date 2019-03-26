import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {TodosService} from "../../app/Todos.service";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public todoService: TodosService, public navCtrl: NavController, private plt: Platform) {
    }

    async ionViewDidEnter() {
        this.plt.ready().then(() => {
            this.todoService.setTodosDb();
        });

    }

}
