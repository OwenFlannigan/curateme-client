import _ from 'lodash';
import { EventEmitter } from 'fbemitter';
var emitter = new EventEmitter();

export default class AudioController extends EventEmitter {
    constructor(data) {
        super();

        this.src = data.src;
        this.id = data.id;
        this.name = data.name;

        this.emitter = emitter;
    }

    getEmitter() {
        return this.emitter;
    }

    setData(data) {
        console.log('data set', data);
        this.src = data.src;
        this.name = data.name;
        this.id = data.id;
        this.trackId = data.trackId;
        this.emitter.emit('updated', data);
    }

    getSource() {
        return this.src;
    }

    // setSource(src) {
    //     this.src = src;
    // }

    getId() {
        return this.id;
    }

    // setId(id) {
    //     this.id = id;
    // }

    getName() {
        return this.name;
    }

    // setName(name) {
    //     this.name = name;
    // }
}