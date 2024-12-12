import React, { Component } from 'react'
import './index.css';

export default class App extends Component {
  constructor(){
    super()
    //棋盘大小
    this.boardSize = 15
    this.state = {
      board:[...Array(this.boardSize).keys()],
      boardArray:Array(this.boardSize**2).fill(-1),
      bgIsBlack:true,//用于判断当前棋子是什么颜色
      blackFirst:true,//用来设置第一次下的棋子颜色
      blackDisabled:false,
      whiteDisabled:false,
      count:0
    }
  }

  //判断格子是否为边界点和角点
  whichClassName(i,j){
    if(i===0 && j===0){
      return'grid lt'
    }
    else if(i===0 && j===this.boardSize-1){
      return'grid rt'
    }
    else if(i===this.boardSize-1 && j===0){
      return'grid lb'
    }
    else if(i===this.boardSize-1 && j===this.boardSize-1){
      return'grid rb'
    }
    else if(i===0){
      return'grid t'
    }
    else if(j===0){
      return'grid l'
    }
    else if(i===this.boardSize-1){
      return'grid b'
    }
    else if(j===this.boardSize-1){
      return'grid r'
    }
    else{
      return'grid'
    }
  }
  blackCheck(){
    this.setState({bgIsBlack:true,blackFirst:true})
  }
  whiteCheck(){
    this.setState({bgIsBlack:false,blackFirst:false})
  }
  render() {
    return (
      <div className='wrapper'>

        <span>先行顺序：</span>
        <input type='radio' name="type" value="黑棋" defaultChecked
        disabled={this.state.blackDisabled}
        onClick={()=>{this.blackCheck()}}
        />
        <span className='inputText'>黑棋</span>
        <input type='radio' name="type" value="白棋"
        disabled={this.state.whiteDisabled}
        onClick={()=>{this.whiteCheck()}}
        />
        <span className='inputText'>白棋</span>
        <br/>

        <button className='btn' onClick={()=>{this.resetClick()}}>重置</button>
        <button className='btn' onClick={()=>{this.backClick()}}>悔棋</button>
        
        <div className='board'>
          {
            this.state.board.map(i=>
              this.state.board.map(j=>
                <div key={i*this.boardSize+j} 
                className={this.whichClassName(i,j)}
                onClick={(e)=>{this.gridClick(e,i,j)}}>
                  {
                    this.state.boardArray[i*this.boardSize+j]!==-1 &&
                    <div className='chess' onClick={(e)=>{e.stopPropagation()}}></div>
                  }

                </div>
              ) 
            )
          }
        </div>
      </div>
    )
  }

  //重置棋盘
  resetClick(){
    if(this.state.count === 0){
      return
    }
    this.setState({ 
      boardArray:Array(this.boardSize**2).fill(-1),
      bgIsBlack:this.state.blackFirst,
      blackDisabled:false,
      whiteDisabled:false,
      count:0
    })
  }

  //悔棋
  backClick(){
    const { bgIsBlack,count } = this.state
    const boardArray = [...this.state.boardArray]

    //count === 1表示要悔最初一步，需要将radio设为可用
    if(count === 1){
      this.setState({ 
        blackDisabled:false,
        whiteDisabled:false
      })
    }
    //如果棋盘上没棋子了则直接返回
    if(count === 0 ){
      return
    } 
    let nowIndex = boardArray.indexOf(count-1)//最后一步所在的位置
    boardArray[nowIndex] = -1
    this.setState({ 
      boardArray:boardArray,
      bgIsBlack:!bgIsBlack,
      count:count-1
    })
  }
  
  //点击落子
  gridClick(e,i,j){
    if(this.state.count===0){
      this.setState({ 
        blackDisabled:true,
        whiteDisabled:true
      })
    }
    //设置棋盘数组
    const arr = [...this.state.boardArray]
    //如果这个格子已有棋子则直接返回
    if(arr[i*this.boardSize+j]!==-1){
      return
    }
    arr[i*this.boardSize+j] = this.state.count
    this.setState({
      bgIsBlack:!this.state.bgIsBlack,
      boardArray:arr,
      count:this.state.count+1
    },()=>{
      //更新状态后设置棋子颜色
      const {style} = e.target.children[0]
      if(!this.state.bgIsBlack){
        style.background = 'black'
      }
      else{
        style.background = 'white'
      }

      //更新状态后进行结算
      //【0黑胜】【1白胜】【-1未结束】【3平】
      let result = this.isOver(i,j)
      setTimeout(()=>{
        if(result===0){
          alert("黑色获胜")
          this.resetClick()
        }
        if(result===1){
          alert("白色获胜")
          this.resetClick()
        }
        if(result===3){
          alert("平局")
          this.resetClick()
        }

      },100)
    })  
  }

  //判断是否结束
  isOver(i0,j0){
    const {bgIsBlack,boardArray,count,blackFirst} = this.state
    const {boardSize} = this

    //判断非平局情况
    let chessSum = 0//各个方向棋子和
    let mod = 0//取模的值，黑色先行，偶数为黑色
    if(!bgIsBlack){//本次落子为黑色
      mod = blackFirst?0:1
    }
    else{//本次落子为白色
      mod = blackFirst?1:0
    }
    //横向
    for(let m=j0;m<boardSize;m++){
      if(boardArray[i0*boardSize+m]%2 === mod){
        chessSum++
      }else{ break }
    }
    for(let n=j0-1;n>=0;n--){
      if(boardArray[i0*boardSize+n]%2 === mod){
        chessSum++
      }
      else{ break }
    }
    if(chessSum >= 5){
      //黑色先行情况下直接返回mod，否则mod为0返回1，mod为1返回0
      return blackFirst?mod:(mod?0:1)
    }
    
    //纵向
    chessSum = 0
    for(let m=i0;m<boardSize;m++){
      if(boardArray[m*boardSize+j0]%2 === mod){
        chessSum++
      }else{ break }
    }
    for(let n=i0-1;n>=0;n--){
      if(boardArray[n*boardSize+j0]%2 === mod){
        chessSum++
      }
      else{ break }
    }
    if(chessSum >= 5){
      //黑色先行情况下直接返回mod，否则mod为0返回1，mod为1返回0
      return blackFirst?mod:(mod?0:1)
    }

    //主对角线
    chessSum = 0
    let tempij=j0
    for(let m=i0;m<boardSize;m++,tempij++){
      if(boardArray[m*boardSize+tempij]%2 === mod){
        chessSum++ 
      }else{ break }
    }
    tempij=j0-1
    for(let n=i0-1;n>=0;n--,tempij--){
      if(boardArray[n*boardSize+tempij]%2 === mod){
        chessSum++
      }
      else{ break }
    }
    if(chessSum >= 5){
      //黑色先行情况下直接返回mod，否则mod为0返回1，mod为1返回0
      return blackFirst?mod:(mod?0:1)
    }

    //反对角线
    chessSum = 0
    tempij=j0
    for(let m=i0;m<boardSize;m++,tempij--){
      if(boardArray[m*boardSize+tempij]%2 === mod){
        chessSum++ 
      }else{ break }
    }
    tempij=j0+1
    for(let n=i0-1;n>=0;n--,tempij++){
      if(boardArray[n*boardSize+tempij]%2 === mod){
        chessSum++
      }
      else{ break }
    }
    if(chessSum >= 5){
      //黑色先行情况下直接返回mod，否则mod为0返回1，mod为1返回0
      return blackFirst?mod:(mod?0:1)
    }

    //平局情况
    if(count === boardSize ** 2){
      return 3
    }else{//未结束
      return -1
    }
  }
}
