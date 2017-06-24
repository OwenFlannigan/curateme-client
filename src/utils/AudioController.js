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
        this.playlist = data.playlist;
        this.emitter.emit('updated', data);
    }

    getPlaylist() {
        return this.playlist;
    }

    getNextTrack() {
        delete this.playlist[0];
        this.playlist = _.compact(this.playlist);
        return this.playlist[0];
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