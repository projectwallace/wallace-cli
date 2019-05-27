const React = require('react')
const {Color} = require('ink')

const Yellow = ({children}) => <Color hex="#ffba1a">{children}</Color>
const Red = ({children}) => <Color hex="#b62020">{children}</Color>
const Dim = ({children}) => <Color dim>{children}</Color>

exports.Yellow = Yellow
exports.Red = Red
exports.Dim = Dim
