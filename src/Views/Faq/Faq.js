import React from 'react'
import {faqData} from '../../Data/faq'
import '../../Styles/css/faq.css'



function Faq() {
    return (
        <div className="row faq-conatiner">
            <div className="col-md-5 faq-left">
                <div className="faq-header">
                    Frequently Asked Questions
                </div>
            </div>
            <div className="col-md-7 faq-right">
                {
                    faqData.map((item: any)=>(
                        <>
                            <div className="faq-question">
                                <span className="q-text">Q.</span>
                                <span>{item.question}</span>
                            </div>
                            {
                                item.answer.map((nestedItem: any)=>(
                                    <>
                                    <div className='option-item'>
                                        <span className="faq-tick">
                                            &#10003;
                                        </span>
                                        <span>
                                            {nestedItem.option}
                                        </span>
                                    </div>
                                    </>
                                ))
                            }
                        </>
                    ))
                }
            </div>
        </div>
    )
}

export default Faq
