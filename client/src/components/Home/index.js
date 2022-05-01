import React from 'react'

const Home = () => {
    return (
        <section className="home" id="home">
            <div className="home-container">
                <div className="left">
                    <h2>Smart Alert Bot System</h2>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laudantium recusandae suscipit atque amet fuga iusto ad ex reiciendis, animi earum.</p>
                    <a className='btn' href=''>Register now</a>
                </div>
                <div className="right">
                    <div className="messages">
                        <div className="r">
                            <span></span>
                            <div>
                                <span className='cnt'>There is power cut in our area. When does it resume?</span>
                            </div>
                        </div>
                        <div className="l">
                            <span className='cnt'>The power supply will be resumed in an hour.</span>
                            <span></span>
                        </div>
                        <div className="r">
                            <span></span>
                            <div>
                                <span className='cnt'>An fire accident happened in my area, so please stop power supply in our area.</span>
                            </div>
                        </div>
                        <div className="l">
                            <span className='cnt'>Okay we will cutoff power supply to your area for while.</span>
                            <span></span>
                        </div>
                        <div className="l">
                            <span className='cnt'>There will be  shutdown from 9:00 am to 6:00 pm.</span>
                            <span></span>
                        </div>
                        <div className="r">
                            <span></span>
                            <div>
                                <span className='cnt'>.&nbsp;.&nbsp;.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home