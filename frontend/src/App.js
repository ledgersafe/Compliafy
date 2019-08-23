import React, { Component } from 'react';
import './App.css';
import Ledger from './components/Ledger'
import BizLedger from './components/BizLedger'
import Product from './components/Product'
import Record from './components/Record'
import Holder from './components/Holder'
import { Col, Row } from 'reactstrap'
import $ from 'jquery'
import LS from './static/LS.png'
import HistoryBlock from './components/HistoryBlock'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ledger: [],
      history: [],
      biz: '',
      bid: '',
    }
    this.selectedAssetID = null;
    this.getAllCannabis = this.getAllCannabis.bind(this);
    this.updateLedger = this.updateLedger.bind(this);
    this.bizQuery = this.bizQuery.bind(this);
    this.getHistory = this.getHistory.bind(this);
    this.updateSelectedAssetID = this.updateSelectedAssetID.bind(this);
    this.updateSidebarHistory = this.updateSidebarHistory.bind(this);
  }

  // componentDidMount always executes first before everything else
  componentDidMount() {
    console.log('component did mount')
    this.getAllCannabis();
  }

  updateSidebarHistory(history){
    console.log(history);
    let list = []
    for(let x in history) {
      var tx = history[x]
      console.log("Transaction: ", tx)
      list.unshift({txId: tx.TxId, holder: tx.Value.holder, amount: tx.Value.amount, timestamp: tx.Timestamp})
    }
    this.setState({ history: list })
  }

  updateSelectedAssetID(value) {
    this.selectedAssetID = value;
    console.log(value)
    this.getHistory();
  }

  getAllCannabis() {
    $.ajax({
      url: 'http://localhost:4000/queryAll',
      type: 'GET',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      crossDomain: true,
      dataType: 'json',
      xhrFields: { withCredentials: true },
      success: (data) => {
        if (data.message === 'OK') {
          console.log('getAllCannabis success!')
          this.updateLedger(data.result);
        }
        else {
          console.log('getAllCannabis ERROR');
        }
      }
    });
  }

  getHistory() {
    let assetId = this.selectedAssetID;
    console.log('calling getHistory ajax', assetId)
    $.ajax({
      url: 'http://localhost:4000/getHistory',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      crossDomain: true,
      dataType: 'json',
      xhrFields: { withCredentials: true },
      data: { assetID : this.selectedAssetID },
      success: (data) => {
        if (data.message === 'OK') {
          console.log('getHistory success!')
          console.log(data.history);
          this.updateSidebarHistory(data.history);
        }
        else {
          console.log('getHistory ERROR');
        }
      }
    });
  }

  //Changes state of 'ledger', automatically refreshes page
  updateLedger(data) {
    var array = [];
    for (var i = 0; i < data.length; i++) {
      parseInt(data[i].Key);
      data[i].Record.Key = parseInt(data[i].Key);
      array.push(data[i].Record);
    }
    array.sort(function (a, b) {
      return parseFloat(a.Key) - parseFloat(b.Key);
    });
    console.log("ARRAY: ", array)
    this.setState({ ledger: array });
  }

  bizQuery(data) {
    console.log('calling bizQuery')
    this.setState({ bid: data })
  }

  render() {
    console.log("App rendering")
    return (
      <div className="App">
        <header className="App-header">
          <img src={LS} alt='LedgerSafe' height='100' width='100' />
          <div className="title">
            Hyperledger Fabric Cannabis Application
        </div>
          <div className="subtitle">LedgerSafe Demo Application</div>
        </header>
        <div className="ui">
          <Row>
            <Col md={2}>
              <h3>Transaction History</h3>
              <ul>
                {
                  this.state.history.length > 0 ? (
                    this.state.history.map((output, i) => {
                      return <HistoryBlock key={i} timestamp={output.timestamp} amount={output.amount} holder={output.holder} txId={output.txId}/>
                    })
                  ) : null
                }
              </ul>
            </Col>
            <Col md={10}>
              <Row>
                <Col md={3} id='column'>
                  <Holder getAllCannabis={this.getAllCannabis} />
                </Col>
                <Col md={9} id='column'>
                  <Ledger ledger={this.state.ledger} style={{ color: '#95c13e' }} updateSelectedAssetID={this.updateSelectedAssetID}/>
                </Col>
              </Row>
              <Row>
                <Col md={3} id='column'>
                  <Product getAllCannabis={this.getAllCannabis} bizQuery={this.bizQuery} />
                </Col>
                <Col md={9} id='column'>
                  <BizLedger bid={this.state.bid} ledger={this.state.ledger} style={{ color: '#69b5e5' }} />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default App;
