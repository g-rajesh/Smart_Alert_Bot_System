import "./SignUp.css";

const SignUp = () => {
    return  (
        <div className="auth">
            <div className="container">
                <h2>TNEB</h2>
                <div className="form">
                    <h2>Sign up</h2>
                    <form>
                        <div className="grid">
                            <div className="form-group">
                                <label htmlFor="fName">First Name</label>
                                <input type="text" name="fName" id="fName"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="lName">Last Name</label>
                                <input type="text" name="lName" id="lName"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="cno">Consumer Number</label>
                            <input type="number" name="cno" id="cno"/>
                        </div>

                        <button className="btn">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;

