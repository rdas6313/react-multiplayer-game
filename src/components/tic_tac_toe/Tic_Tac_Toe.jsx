import React, { Component } from 'react';
import GameBoard from './gameBoard';
import { isGameFinished, isThereAnyWinner } from '../../gamelogics/tic_tac_toe/gameAlgo';
import MsgBox from '../common/msgBox';
import Tic_Tac_Toe_MsgBox from './tic_tac_toe_msgBox';
import LinkBox from '../common/linkBox';
import config from '../../configs/tic_tac_toe/config';
import { write,updateData, readOnce, addDataChangeEventListener, removeDataChangeEventListener } from '../../services/remoteService';
import log from '../../services/logger';

class Tic_Tac_Toe extends Component {
  
  state = {}

  constructor(props) {
    super(props);
    this.state = {
      board: [
        null, null, null,
        null, null, null,
        null, null, null
      ],
      turn: 0,
      isFinished: false,
      isBoardDisabled: true,
      you: config.char.x,
      opponent: config.char.o,
      gameId: null,
      msg: null,
      isConnected:false
    };
  }

  handleSquareClick = async (id) => {
    const { board, turn, isFinished: oldFinished, isBoardDisabled: oldDisabled, msg: oldMsg } = this.state;
    const new_board = [...this.state.board];
    if (new_board[id - 1])
      return;
    const nextTurn = (this.state.turn + 1) % 2;
    if (this.state.isConnected) {
      new_board[id - 1] = this.state.you;
      const isFinished = (isThereAnyWinner(new_board) || isGameFinished(new_board));
      const msg = this.getGameMsg(isFinished, new_board, nextTurn);
      this.setState({ board: new_board, turn: nextTurn, isFinished, msg: msg, isBoardDisabled: true });
      const isSuccess = await this.uploadBoardData(new_board, nextTurn);
      if (!isSuccess)
        this.setState({ board, turn, isFinished: oldFinished, msg: oldMsg, isBoardDisabled: oldDisabled });
      
    } else {
      new_board[id - 1] = this.state.turn === 0 ? this.state.you : this.state.opponent;
      const isFinished = (isThereAnyWinner(new_board) || isGameFinished(new_board));
      const msg = this.getGameMsg(isFinished, new_board, nextTurn);
      this.setState({ board: new_board, turn: nextTurn, isFinished, msg: msg, isBoardDisabled: isFinished });
    }
  }


  async uploadBoardData(board,nextTurn) {
    log("Board Data uploading happened");
    const boardPath = `${config.code}/${this.state.gameId.id}/${config.gameData}`;
    const data = {};
    data[config.board] = board;
    data[config.turn] = nextTurn; 
    try {
      await updateData(boardPath, data);
    } catch (error) {
      const msg = config.msg.tryLater;
      this.setState({ msg });
      return false;
    }
    return true;
  }

  getGameMsg(isFinished,board,nextTurn) {

    const yourTurnMSg = config.msg.yourTurnMsg;
    const opponentTurnMsg = config.msg.opponentTurnMsg;
    const yourWinMsg = config.msg.yourWinMsg;
    const youLostMsg = config.msg.youLostMsg;
    const drawMsg = config.msg.drawMsg;
    const { x, o } = config.char;
    let msg = (nextTurn === 0 && this.state.you === x) || (nextTurn === 1 && this.state.you === o)
      ? this.renderWarningMSg(yourTurnMSg,config.msgKey.turn) : this.renderWarningMSg(opponentTurnMsg,config.msgKey.turn);
    
      if (isFinished) {
        if (isThereAnyWinner(board)) {
          msg = (nextTurn === 0 && this.state.you === o) || (nextTurn === 1 && this.state.you === x) ? this.renderSuccessMsg(yourWinMsg,config.msgKey.win) : this.renderDangerMSg(youLostMsg,config.msgKey.lost);
        }else 
          msg = this.renderDangerMSg(drawMsg,config.msgKey.draw);
      }
    
    return msg;
  }

  renderSuccessMsg(msg,key) {
    return <span key={key} className="badge bg-success">{msg}</span>;
  }

  renderWarningMSg(msg,key) {
    return <span key={key} className="badge bg-warning text-dark">{msg}</span>;
  }

  renderDangerMSg(msg,key) {
    return <span key={key} className="badge bg-danger">{msg}</span>;
  }

  generateLink() {
    const { origin } = window.location;
    const { gameId } = this.state;
    if (!gameId || !gameId.userGenerated)
      return null;
    const link = `${origin}/${config.name}/${gameId.id}`;
    return link;
  }

  async generateIdToServer() {
    const path = `${config.code}`;
    const data = {};
    const gameData = {};
    gameData[config.turn] = 0;
    gameData[config.board] = null;
    data[config.playerCount] = 1;
    data[config.gameData] = gameData;
    
    
    try {
      const uId = await write(path, data);
      this.setGameid(uId);
      return uId;
    } catch (error) {
      
      const msg = error// generate user msg here
      this.setState({ msg: this.renderDangerMSg(msg,config.msgKey.serverError), isBoardDisabled: false });
      return null;
    }
  }

  setGameid(id,isUserGenerated=true) {
    const gameId = {
      id: id,
      userGenerated : isUserGenerated
    };
    this.setState({ gameId });
  }

  async isIdValid(id) {
    const datapath = `${config.code}/${id}`;
    try {
      const data = await readOnce(datapath);
      if (!data.isDataExist || !data.value)
        return false;
      return true;
    } catch (error) {
      return false;  
    }
  }

  async prepareTostart(id) {
    const isIdValid = await this.isIdValid(id);
    if (!isIdValid) {
      const msg = config.msg.invalidUrl;
      this.setState({ msg:this.renderDangerMSg(msg,config.msgKey.invalidUrl),isBoardDisabled:false });
      return;
    }
    
    this.setGameid(id,false);
    const path = `${config.code}/${id}/${config.playerCount}`;
    try {
      const data = await readOnce(path);
      if ((data.isDataExist && data.value > 1) || (!data.isDataExist || !data.value)) {
        //show msg that url is compromised.please start a new session.
        log("Already registered user", data.value);
        const msg = config.msg.gameUrlCompromised;
        this.setState({ msg,isBoardDisabled:false  });
        return;
      }
      const value = data.value + 1;
      await updateData(path, value);
      
    } catch (error) {
      this.setState({msg:error,isBoardDisabled:false })// generate user msg here
      return;
    }
   
    const playerCountPath = `${config.code}/${id}/${config.playerCount}`;
    addDataChangeEventListener(playerCountPath, this.onPlayerCountChange);
    const { x, o } = config.char;
    this.setState({ you: o, opponent: x, turn: 0 });
  }

  onGameDataChange = (data) => {
    log("Game data change", data);
    if (!data.isDataExist)
      return;
    const gameData = data.value;
    const boardData = gameData[config.board];
    const turn = gameData[config.turn];
    if (turn === this.state.turn)
      return;
    const newBoard = [...this.state.board];
    const { x, o } = config.char;
    const isBoardDisabled = ((this.state.you === x && turn === 0) || (this.state.you === o && turn === 1)) ? false : true;
    if (boardData) {
      Object.keys(boardData).map((key) => {
        newBoard[key] = newBoard[key] !== boardData[key] ? boardData[key] : newBoard[key]; 
      });
      const isFinished = (isThereAnyWinner(newBoard) || isGameFinished(newBoard));
      const msg = this.getGameMsg(isFinished, newBoard, turn);
      this.setState({ board: newBoard,turn,isBoardDisabled : (isBoardDisabled || isFinished),isFinished,msg });  
    } else {
      this.setState({turn,isBoardDisabled }); 
    }
  }

  onPlayerCountChange = (data) => {
    const gamePath = `${config.code}/${this.state.gameId.id}/${config.gameData}`;
    const playerCount = data.value;
    if (!data.isDataExist) {
      const msg = config.msg.playerLeft;
      this.setState({ msg,isBoardDisabled:false,isConnected:false  });
      removeDataChangeEventListener(gamePath);
    }
    else if (playerCount > 2) {
      removeDataChangeEventListener(gamePath);
      const msg = config.msg.gameUrlCompromised;
      this.setState({ msg,isBoardDisabled:false,isConnected:false  });
    } else if (playerCount == 2) {
      const msg = this.getGameMsg(this.state.isFinished, this.state.board, this.state.turn);
      log(this.state.turn, msg);
      const { x, o } = config.char;
      const isBoardDisabled = this.state.you === x && this.state.turn === 0 ? false : true;
      this.setState({ isConnected: true,msg,isBoardDisabled });
      addDataChangeEventListener(gamePath, this.onGameDataChange);
    }
  }

  onChangeConnectionWithServer = (data)=> {
    if (!data.isDataExist || !data.value) {
      log("Not Connected to internet", data.value);
      const msg = <span key="connectionMsg" className='badge bg-danger m-1'>{config.msg.serverDisconnection}</span>;
      const msgs = this.state.msg ? [msg,this.state.msg] : [msg];
      this.setState({msg:msgs});
    } else {
      log("Connected to internet", data.value);
      let msgs = null;
      if (this.state.msg) {
        msgs = [...this.state.msg];
        msgs = msgs.filter((m) => m.key != "connectionMsg");
      }
      this.setState({msg:msgs});
    }  
  }

  async componentDidMount() {
    const { match } = this.props;
    addDataChangeEventListener(config.path.serverConnectionChecking, this.onChangeConnectionWithServer);
    if (!match) {
      const gameId = await this.generateIdToServer();
      if (gameId) {
        const playerCountPath = `${config.code}/${gameId}/${config.playerCount}`;
        addDataChangeEventListener(playerCountPath, this.onPlayerCountChange);
        window.addEventListener('beforeunload', this.keepOnPage);
      } 
      return;
    }
    const id = match.urlParam;
    const msg = config.msg.wait;
    this.setState({ msg });
    this.prepareTostart(id);
    window.addEventListener('beforeunload', this.keepOnPage);
  }

  keepOnPage = (e) => {
    var message = config.msg.windowClose;
    e.returnValue = message;
    this.cleanUp();
    return message;
  }

  cleanUp() {
    if (!this.state.gameId)
      return;
    const playerCountPath = `${config.code}/${this.state.gameId.id}/${config.playerCount}`;
    const boardPath = `${config.code}/${this.state.gameId.id}/${config.gameData}`;
    const gamePath = `${config.code}/${this.state.gameId.id}`;
    removeDataChangeEventListener(playerCountPath);
    removeDataChangeEventListener(boardPath);
    removeDataChangeEventListener(config.path.serverConnectionChecking);
    updateData(gamePath, null);
    log("Cleaning up");
  }

  componentWillUnmount() {
    
    window.removeEventListener('beforeunload', this.keepOnPage);
    log("Unmounting component");
  }
  
  render() { 
    const gameMsg = this.state.msg;
    const titleMsg = <span className="badge bg-primary">Tic_Tac_Toe</span>;
    return (
      <div className="container">
          <div className="row">
              <div className="col-sm mt-5 me-1">
                  <GameBoard
                    data={
                      {
                        board: this.state.board,
                        onSquareClick: this.handleSquareClick,
                        disabled:this.state.isBoardDisabled
                      }
                    }
                  />             
              </div>
              <div className="col-sm m-5">
                  <MsgBox
                    content={
                      {
                        title : titleMsg,
                        contents: [
                          <LinkBox key="ttt_linkbox" link={this.generateLink()} />,
                          <Tic_Tac_Toe_MsgBox key="ttt_msgbox2" msg={gameMsg} />

                        ]    
                      }
                    }
                  />
              </div>
          </div>
      </div>
     
    );
  }
}
 
export default Tic_Tac_Toe;
