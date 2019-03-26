// Class comportant tous les TODOS

import { Injectable } from '@angular/core';
import { Todo } from './todo.model';
import { HTTP } from '@ionic-native/http';
import { AlertController } from "ionic-angular";

@Injectable()
export class TodosService {

    todos: Todo[];
    todoDbUrl = 'http://10.9.60.157:3000/todos/';

    constructor(private http: HTTP, private alertCtrl: AlertController) {}

    someTodos() {
        let todos = new Array<Todo>();

        for (let i = 1; i <= 20; i++) {
            let newTodo = new Todo();
            newTodo.id = i;
            newTodo.nom = "Todo"+i;
            todos.push(newTodo);
        }
        return todos;
    }

// Ajoute à la db le nouveau Todo de nom todoName
    async addTodo(todoName)
    {
        if (todoName.length >= 1) {
            const newTodo = new Todo();
            newTodo.nom = todoName;

            try {
                await this.http.post(this.todoDbUrl, newTodo, {});
            } catch (e) {}
            this.setTodosDb();
            // subscribe(...) permet de mettre à jour la liste de Todos
        }
    }

    async addTodoPrompt()
    {
        const alert = this.alertCtrl.create({
            title: "Nouveau TODO",
            inputs: [{
                name: "nom",
                placeholder: "Nom"
            }],
            buttons: ['Annuler'],
        });

        alert.addButton({
            text: 'Ajouter',
            handler: data => {
                this.addTodo(data.nom);
            },
        });

        alert.present();
    }

    // Supprime le todo d'id id
    async delTodo(id)
    {
        const deleteUrl = this.todoDbUrl + id;
        try {
            await this.http.delete(deleteUrl, {}, {});
        } catch (e) {}
        this.setTodosDb(); // Recharger tout les todo après suppression => Pas le mieux à faire
    }

//     // Met à jour le Todo todo
    async updateTodo(todo: Todo)
    {
        try {
            await this.http.put(this.todoDbUrl + todo.id, todo, {});
        } catch (e) {}
    }

    updateTodoPrompt(todo: Todo)
    {
        const alert = this.alertCtrl.create({
            title: "Modifier le TODO",
            inputs: [{
                name: "nom",
                placeholder: "Nom",
                value: todo.nom,
            }],
            buttons: ['Annuler'],
        });

        alert.addButton({
            text: 'Modifier',
            handler: data => {
                todo.nom = data.nom;
                this.updateTodo(todo);
            },
        });

        alert.present();
    }

    // Retourne tous les todos depuis la db sous forme de tableau de Todo
    async setTodosDb()
    {
        try {
            let todosJson = await this.getTodosFromUrl();
            const todosTab = JSON.parse(todosJson);

            let todos = new Array<Todo>();

            for (let i = 0; i < todosTab.length; i++) {
                let t = new Todo();
                t.id = todosTab[i].id;
                t.nom = todosTab[i].nom;
                todos.push(t);
            }

            this.todos = todos;
        } catch (error) {
            console.log(error);
        }
    }

    // Retourne les données de la db
    async getTodosFromUrl() {
        const a = await this.http.get(this.todoDbUrl, {}, {});
        return a.data;
    }

    alo(e?) {
        e ? console.log(e) : console.log('alo');
    }

}
