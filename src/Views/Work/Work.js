import React from 'react'
import {workData} from '../../Data/work'
import '../../Styles/css/work.css'

function Work() {
    return (
        <div className="row work-container">
            <div className="col-md-5 work-left">
                <div className="work-header">How It Works?</div>
            </div>
            <div className="col-md-7 work-right">

                {
                    workData.map((item , index )=>(
                        <div className="work-number">
                            { "0"+(index+1)}
                            <div className="work-item">
                            <span className="work-content-header">{item.title}</span>
                            {
                                item.option?.map((innerItem)=>(
                                    <span className="work-subtitle">{innerItem.subtitle}</span>
                                ))
                            }
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default Work
