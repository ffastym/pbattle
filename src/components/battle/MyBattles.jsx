/**
 * @author Yuriy Matviyuk
 */
import React, { Component } from 'react'
import battle from '../../api/axios/battle'
import { Trans } from 'react-i18next'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import SwipeableViews from 'react-swipeable-views'
import AppBar from '@material-ui/core/AppBar'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import BattlePreview from './BattlePreview'
import BattlesActionsPanel from './BattlesActionsPanel'

/**
 * MyBattles component
 */
class MyBattles extends Component {
  /**
     * MyBattles Constructor
     *
     * @param props
     */
  constructor (props) {
    super(props)
        
    this.state = {
      activeTab: 0,
      requestedBattles: [],
      activeBattles: [],
      activeBattlesHtml: [],
      requestedBattlesHtml: [],
      pendingBattlesHtml: [],
      checkedBattles: []
    }
    this.tabChange = this.tabChange.bind(this)
    this.changeIndex = this.changeIndex.bind(this)
    this.getListHtml = this.getListHtml.bind(this)
    this.checkBattle = this.checkBattle.bind(this)
    this.uncheckAll = this.uncheckAll.bind(this)
    this.acceptBattles = this.acceptBattles.bind(this)
    this.rejectBattles = this.rejectBattles.bind(this)
  }

  componentDidMount () {
    setTimeout(() => { // TODO: remove timeout
      battle.getUserBattles(this.props.battles).then(({ data }) => {
        let requestedBattles = []
        let activeBattles = []
        let pending = []

        data.forEach(battle => {
          if (battle.active) {
            activeBattles.push(battle)
          } else if (battle.author === this.props.userId) {
            pending.push(battle)
          } else {
            requestedBattles.push(battle)
          }
        })

        this.setState({
          requestedBattles,
          activeBattles,
          requestedBattlesHtml: this.getListHtml(requestedBattles, 'requested'),
          activeBattlesHtml: this.getListHtml(activeBattles, 'active'),
          pendingBattlesHtml: this.getListHtml(pending, 'pending')
        })
      })
    }, 200)
  }

  uncheckAll () {
    this.setState({ checkedBattles: [] })
    this.requestedWrapperRef.classList.remove('check-marks')

    const previews = document.querySelectorAll('.battle-preview')

    if (previews) {
      previews.forEach(preview => {
        preview.classList.remove('checked')
      })
    }
  }

  tabChange (e, val) {
    this.setState({ activeTab: val })
  }

  acceptBattles () {
    const state = this.state

    battle.acceptBattles(state.checkedBattles).then(({ data }) => {
      if (data.success !== false) {
        let requestedBattles = state.requestedBattles.filter((val) => {
          return !state.checkedBattles.includes(val._id)
        })

        let activeBattles = [...state.activeBattles, ...data]

        this.setState({
          requestedBattles,
          activeBattles,
          activeBattlesHtml: this.getListHtml([...state.activeBattles, ...data], 'active'),
          requestedBattlesHtml: this.getListHtml(requestedBattles, 'requested')
        }, this.uncheckAll)
      }
    })
  }

  rejectBattles () {
    const state = this.state

    battle.rejectBattles(state.checkedBattles).then(({ data }) => {
      if (data.success !== false) {
        let requestedBattles = state.requestedBattles.filter((val) => {
          return !state.checkedBattles.includes(val._id)
        })

        this.setState({
          requestedBattles,
          requestedBattlesHtml: this.getListHtml(requestedBattles, 'requested')
        }, this.uncheckAll)
      }
    })
  }

  checkBattle (e) {
    let checkedBattles = [...this.state.checkedBattles]
    const element = e.currentTarget
    const battleId = element.dataset.id
    const index = checkedBattles.indexOf(battleId)

    this.requestedWrapperRef.classList.add('check-marks')

    if (index !== -1) {
      checkedBattles.splice(index, 1)
      element.classList.remove('checked')
    } else {
      checkedBattles.push(battleId)
      element.classList.add('checked')
    }

    this.setState({ checkedBattles })
  }

  changeIndex (val) {
    this.setState({ activeTab: val })
  }

  /**
   * Render battles list by type
   *
   * @param battles
   * @param type string
   *
   * @returns {[]}
   */
  getListHtml (battles, type) {
    let html = []

    battles.forEach((battle, index) => {
      html.push(
        <BattlePreview key={index} battle={battle} type={type} checkBattle={this.checkBattle} />
      )
    })

    return html
  }

  /**
     * Render MyBattles component
     */
  render () {
    const activeTab = this.state.activeTab

    return (
      <div className='my-battles-wrapper'>
        <h1 className="title">
          <Trans>myBattles</Trans>
        </h1>
        <AppBar position="static" color="default">
          <Tabs
            value={activeTab}
            onChange={this.tabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="My battles"
          >
            <Tab label="Requested" id='full-width-tab-1' aria-controls='full-width-tabpanel-1'/>
            <Tab label="Pending" id='full-width-tab-2' aria-controls='full-width-tabpanel-2' />
            <Tab label="Active" id='full-width-tab-3' aria-controls='full-width-tabpanel-3' />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis='x'
          index={activeTab}
          onChangeIndex={this.changeIndex}
        >
          <div className='battles-wrapper requested' role="tabpanel" hidden={activeTab !== 0}
            id='full-width-tabpanel-1'
            ref={node => { this.requestedWrapperRef = node }}
            aria-labelledby='full-width-tab-1'>
            <BattlesActionsPanel qty={this.state.checkedBattles.length}
              uncheckAll={this.uncheckAll}
              removeBattles={this.rejectBattles}
              acceptBattles={this.acceptBattles}/>
            {this.state.requestedBattlesHtml}
          </div>
          <div className='battles-wrapper' role="tabpanel" hidden={activeTab !== 1}
            id='full-width-tabpanel-2'
            aria-labelledby='full-width-tab-2'>
            {this.state.pendingBattlesHtml}
          </div>
          <div className='battles-wrapper' role="tabpanel" hidden={activeTab !== 2}
            id='full-width-tabpanel-3'
            aria-labelledby='full-width-tab-3'>
            {this.state.activeBattlesHtml}
          </div>
        </SwipeableViews>
      </div>
    )
  }
}

MyBattles.propTypes = {
  battles: PropTypes.array,
  userId: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    battles: state.user.battles,
    userId: state.user.id
  }
}

const mapDispatchToProps = () => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(MyBattles)
