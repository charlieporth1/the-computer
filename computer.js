var delictCodes = {
  '100': 'Theft while on scooter',
  '101': 'Theft from bike',
  '102': 'Street robbery',
  '104': 'Burglary',
  '105': 'Theft while on or in motorized vehicle',
  '106': 'Motor vehicle theft',
  '107': 'Shoplifting',
  '108': 'Pickpocketing',
  '109': 'Violent threat',
  '110': 'Abuse',
  '111': 'Vandalism',
  '117': 'Robbery'
}

var output = ''
var month = new Date().getMonth() + 1

var pull = new XMLHttpRequest()

pull.open('GET', `https://io.neufv.website/kabk/computer/?m=${month}`, true)
pull.onreadystatechange = () => {
  if (pull.readyState === XMLHttpRequest.DONE) {
    processedList = JSON.parse(pull.responseText)
    var count = 1

    for (result of processedList) {
      output += '<p>'
      output += count + '. ' + result['name']
      output += '&rarr;<span>'
      output += delictCodes[result['delict']]
      output += '</span></p>'

      count += 1
    }

    document.getElementById('list').innerHTML = output
  }
}
pull.send()
