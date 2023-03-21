/* eslint-disable array-callback-return */
import React, { Component } from "react";
import {
  vocabulary as get_vocabulary,
} from "./FileManager";

import "react-notifications/lib/notifications.css";
import "./RandomizeManager.css";

class App extends Component {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
    this.reload = this.reload.bind(this);
    this.selectType = this.selectType.bind(this);
    this.selectWord = this.selectWord.bind(this);
    this._red = this._red.bind(this);
    this._orange = this._orange.bind(this);
    this._green = this._green.bind(this);
    this.random = this.random.bind(this);
    this.next = this.next.bind(this);

    this.state = {
      current: 0,
      hangul: undefined,
      romanji: undefined,
      english: undefined,
      selectedType: undefined,
      selectedWord: undefined,
      red: false,
      orange: false,
      green: false,
      show: false,
      vocabulary: [],
      vocabulary_filtered: []
    };
  }

  async componentDidMount() {
    if (this.loaded) return;
    this.loaded = true;
    
    this._red();
    this._orange();
  }
  
  selectType(event) {
    const type = event.target.value;

    let vocabulary_filtered = type ? this.state.vocabulary.filter(x => x.type === type) : this.state.vocabulary;
    if (["number", "clock", "date"].includes(type)) {
      vocabulary_filtered.sort((a, b) => { if (a.english < b.english) { return -1 }});
    };
    
    this.setState({
      selectedType: type,
      vocabulary_filtered
    }, () => {
      const {
        hangul,
        romanji,
        english
      } = this.state.vocabulary_filtered[0] || {};
      
      this.setState({
        current: 0,
        hangul: hangul || "END",
        romanji: romanji || "END",
        english: english || "END"
      });
    });
  }
  
  selectWord(event) {
    const selectedIndex = event.target.options.selectedIndex;
    const current = parseInt(event.target.options[selectedIndex].getAttribute('data-key'), 10);
    
    const {
      hangul,
      romanji,
      english
    } = this.state.vocabulary_filtered[current] || {};
    
    this.setState({
      current,
      hangul: hangul || "END",
      romanji: romanji || "END",
      english: english || "END"
    });
  }
  
  _red() {
    this.setState({ red: !this.state.red }, () => {
      this.reload();
    });
  }
  
  _orange() {
    this.setState({ orange: !this.state.orange }, () => {
      this.reload();
    });
  }
  
  _green() {
    this.setState({ green: !this.state.green }, () => {
      this.reload();
    });
  }
  
  async reload() {
    document.getElementById("red").checked = this.state.red;
    document.getElementById("orange").checked = this.state.orange;
    document.getElementById("green").checked = this.state.green;
    let vocabulary = await get_vocabulary({});
    
    //console.log(this.state.red, this.state.orange, this.state.green);
    vocabulary = vocabulary.filter(x => {
      if (this.state.red && ["red"].includes(x.severity)) return x;
      if (this.state.orange && ["orange"].includes(x.severity)) return x;
      if (this.state.green && ["green"].includes(x.severity)) return x;
    });
    vocabulary.sort((a, b) => { if (a.romanji < b.romanji) { return -1 }});
    
    const {
      hangul,
      romanji,
      english
    } = vocabulary[0] || {};
    
    this.setState({
      current: 0,
      hangul: hangul || "END",
      romanji: romanji || "END",
      english: english || "END",
      vocabulary,
      vocabulary_filtered: vocabulary
    });
  }

  toggle() {
    this.setState({
      show: !this.state.show
    });
    const roman = document.getElementsByClassName("romanji");
    for (var i = 0; i < roman.length; i++) { this.state.show ? roman[i].style.color = 'white' : roman[i].style.color = 'black' };
    const eng = document.getElementsByClassName("english");
    for (var j = 0; j < eng.length; j++) { this.state.show ? eng[j].style.color = 'white' : eng[j].style.color = 'black' };
  }
  
  random() {
    let r = NaN;
    while (isNaN(r) || r === this.state.current) {
      r = Math.floor(Math.random() * this.state.vocabulary_filtered.length);
    };
  
    const {
      hangul,
      romanji,
      english
    } = this.state.vocabulary_filtered[r] || {};
    
    this.setState({
      current: r,
      hangul: hangul || "END",
      romanji: romanji || "END",
      english: english || "END"
    });
  }
  
  next() {
    const {
      hangul,
      romanji,
      english
    } = this.state.vocabulary_filtered[this.state.current + 1] || {};
    
    this.setState({
      current: this.state.current + 1,
      hangul: hangul || "END",
      romanji: romanji || "END",
      english: english || "END"
    });
  }

  render() {
    return (
      <div>
        <table className="table">
          <tbody>
            <tr>
              <td>
                <input type="checkbox" id="red" value="red" onChange={this._red} /><label style={{"color": "red"}}>Always used</label>
                <input type="checkbox" id="orange" value="orange" onChange={this._orange} /><label style={{"color": "orange"}}>Found in book</label>
                <input type="checkbox" id="green" value="green" onChange={this._green} /><label style={{"color": "green"}}>From Class</label>
              </td>
            </tr>
          </tbody>
        </table>
        
        <table className="table">
          <tbody>
            <tr>
              <td className="hangul">
                {this.state.hangul}
              </td>
            </tr>
            <tr>
              <td className="romanji">
                {this.state.romanji}
              </td>
            </tr>
            <tr>
              <td className="english">
                {this.state.english}
              </td>
            </tr>
          </tbody>
        </table>
        
        <table className="table">
          <tbody>
            <tr>
              <td>
                <input type="checkbox" id="toggle" value="toggle" onChange={this.toggle} />Show
              </td>
            </tr>
          </tbody>
        </table>
        
        <table className="table">
          <tbody>
            <tr>
              <td style={{"textAlign": "center"}}>
                <button type="button" title="random" onClick={this.random}>Random</button>
              </td>
            </tr>
            <tr>
              <td style={{"textAlign": "center"}}>
                <button type="button" title="next" onClick={this.next}>Next</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <table className="table">
          <tbody>
            <tr>
              <td>
                <select className="drop" style={{"width": "180px"}} id="types" onChange={this.selectType}>
                  {
                    ([undefined]).concat(Array.from(new Set(this.state.vocabulary.map(x => x.type)))).map((type, i) => {
                      return (
                        <option key={i} value={type}>{type}</option>
                      )
                  })}
                </select> 

                <select className="drop" style={{"width": "500px"}} id="words" onChange={this.selectWord}>
                  {
                    this.state.vocabulary_filtered.map((x, i) => {
                      return (
                        <option key={i} data-key={i} value={x.hangul}>{x.hangul} ({x.romanji})</option>
                      )
                  })}
                </select> 
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
