var map
var markers = []
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
    document.getElementById('loader').innerHTML = ''
    processedList = JSON.parse(pull.responseText).reverse()
    var count = 0

    var infowindow = new google.maps.InfoWindow({
      content: ''
    })

    for (result of processedList) {
      markers[count] = new google.maps.Marker({
          position: {
            lat: parseFloat(result['latitude']),
            lng: parseFloat(result['longitude'])
          },
          title: count.toString(),
          map: map,
          icon: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: 'red',
              fillOpacity: (count + 1) * 0.025,
              scale: 50,
              strokeColor: 'red',
              strokeWeight: 1
          },
          raw: result,
          count: count
      })

      markers[count].addListener('click', function(marker) {
        result = this.raw
        count = this.count

        var markerContent = getMarkerContent(result, count)

        for (marker of markers) {
          if (
            parseFloat(result['latitude']).toFixed(6) === parseFloat(marker.position.lat()).toFixed(6) &&
            parseFloat(result['longitude']).toFixed(6) === parseFloat(marker.position.lng()).toFixed(6) &&
            marker.count !== count
          ) {
            markerContent += getMarkerContent(marker.raw, marker.count)
          }
        }

        infowindow.setContent(markerContent)
        infowindow.open(map, this)
      })

      count += 1
    }
  }
}

function getMarkerContent(result, count) {
  return '<p><strong>' +
    delictCodes[result['delict']] +
    '</strong></p><p>Likelihood: ' +
    '<div class="star"></div>'.repeat(parseInt((count + 1 ) / 2)) +
    '<div class="blank"></div>'.repeat(parseInt(10 - ((count + 1 ) / 2))) +
    '</p>'
}

function initMap() {
  var styledMapType = new google.maps.StyledMapType(
  [
    {
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "color": "#131313"
            },
            {
                "lightness": 7
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 25
            }
        ]
    }
  ],
  {name: 'The Computer'})

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 52.0634406, lng: 4.3094183},
    zoom: 12,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
              'styled_map']
    }
  })

  map.mapTypes.set('styled_map', styledMapType)
  map.setMapTypeId('styled_map')
  pull.send()
}
