import React from "react";
import ReactDom from "react-dom";

class Layout extends React.Component {	
	render() {
		return (
			<h1 class="helloWorld">It Works999999!</h1>
		);
	}
}

const app = document.createElement("div");
app.id="app";
document.body.appendChild(app);
ReactDom.render(<Layout/>, document.getElementById("app"));
