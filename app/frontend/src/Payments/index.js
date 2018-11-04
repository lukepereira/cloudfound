import React from 'react'

import axios from 'axios'
import {
    CardElement,
    Elements,
    injectStripe,
    InjectedProps,
} from 'react-stripe-elements'
import './Payments.css'

class _CardForm extends React.Component<InjectedProps & {fontSize: string}> {

    constructor(props) {
        super(props)
        this.state = {
            amount: 0,
        }
    }    
    
    handleAmountChange = (event) => this.setState({amount: event.target.value})
    
    createCharge = (stripeToken) => {
        console.log('[token]', stripeToken)

        //TODO: Move to api config 
        const post_url = 'https://us-central1-scenic-shift-130010.cloudfunctions.net/handle_charge'    
        const config = { 
            headers: {  
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
        axios.post(
            post_url, 
            { 
                stripeToken: stripeToken,
                amount: this.state.amount,
            },
            config,
        )
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    handleSubmit = (ev) => {
        ev.preventDefault()
        if (this.state.amount < 1) {
            return
        }
        if (this.props.stripe) {
            this.props.stripe
            .createToken()
            .then((payload) => this.createCharge(payload))
        } else {
            console.log("Stripe.js hasn't loaded yet.")
        }
    }
  
    
    handleBlur = () => {
        console.log('[blur]')
    }
    handleChange = (change) => {
        console.log('[change]', change)
    }
    handleClick = () => {
        console.log('[click]')
    }
    handleFocus = () => {
        console.log('[focus]')
    }
    handleReady = () => {
        console.log('[ready]')
    }
    
    createOptions = (fontSize: string, padding: ?string) => {
        return {
            style: {
                base: {
                    fontSize,
                    color: '#424770',
                    letterSpacing: '0.025em',
                    fontFamily: 'Source Code Pro, monospace',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                    ...(padding ? { padding } : {}),
                },
                invalid: {
                    color: '#9e2146',
                },
            },
        }
    }
  
    render() {
        return (
            <div>
                <label>
                    Amount
                    <input 
                        placeholder="0 USD" 
                        onChange={this.handleAmountChange}>
                        
                    </input>
                </label>
                
                <label>
                    Card details
                    <CardElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        hidePostalCode={true}
                        {...this.createOptions(this.props.fontSize)}
                    />
                </label>
                <button onClick={this.handleSubmit}>Pay</button>
            </div>
        )
    }
}
const CardForm = injectStripe(_CardForm)

class Payments extends React.Component<{}, {elementFontSize: string}> {
    constructor() {
        super()
        this.state = {
            elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
        }
        window.addEventListener('resize', () => {
            if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
                this.setState({elementFontSize: '14px'})
            } else if (
                window.innerWidth >= 450 &&
                this.state.elementFontSize !== '18px'
            ) {
                this.setState({elementFontSize: '18px'})
            }
        })
    }

    render() {
        const {elementFontSize} = this.state
        
        return (
            <div className="Payments">
                <h1>Payments</h1>
                <Elements>
                    <CardForm fontSize={elementFontSize} />
                </Elements>
            </div>
        )
    }
}

export default Payments