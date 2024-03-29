const db = require('../db/db')

const url = require('url')

// RESULTS FUNCTIONS
//
const getPreferredResult = (request, response) => {
    // Save all params
    const queryObject = url.parse(request.url, true).query;
    console.log(queryObject);

    city = '%'
    if (queryObject.city) {
        city = queryObject.city
    }

    state = '%'
    if (queryObject.state) {
        state = queryObject.state
    }

    mintemp = -100
    if (queryObject.mintemp) {
        mintemp = queryObject.mintemp
    }

    maxtemp = 500
    if (queryObject.maxtemp) {
        maxtemp = queryObject.maxtemp
    }

    minprice = 0
    if (queryObject.minprice) {
        minprice = queryObject.minprice
    }

    maxprice = 100000000
    if (queryObject.maxprice) {
        maxprice = queryObject.maxprice
    }

    zipcode = ''
    console.log("before zip query")
    if (queryObject.zipcode) {
	zipcode = queryObject.zipcode
        db.query('SELECT * FROM zipcodes WHERE zip = $1', [zipcode], (err, results) => {
            if (err) {
                throw err
            }
            inLat = results.rows[0].latitude
            inLon = results.rows[0].longitude
            console.log("Zipcode,lat,lon: ", zipcode, inLat, inLon)
        })
        console.log("after zip query")
    }
    max_dist = 0
    if (queryObject.max_distance) {
	max_dist = queryObject.max_distance
    }

    onebedroom = 0
    if (queryObject.onebed) {
        onebedroom = queryObject.onebed
    }
    twobedroom = 0
    if (queryObject.twobed) {
        twobedroom = queryObject.twobed
    }
    threebedroom = 0
    if (queryObject.threebed) {
        threebedroom = queryObject.threebed
    }
    fourbedroom = 0
    if (queryObject.fourbed) {
        fourbedroom = queryObject.fourbed
    }
    fiveormorebedroom = 0
    if (queryObject.fiveplusbed) {
        fiveormorebedroom = queryObject.fiveplusbed
    }
    singlefamilyresidence = 0
    if (queryObject.singlefamily) {
        singlefamilyresidence = queryObject.singlefamily
    }

   console.log("City", city)
   console.log("State", state)
   console.log("Min Price", minprice)
   console.log("Max Price", maxprice)
   console.log("Min temp", mintemp)
   console.log("Max temp", maxtemp)
   console.log("Zip Code", zipcode)
   console.log("Max Dist", max_dist)

    // $1 = state, $2 = city, $3 = minprice, $4 = maxprice, $5 = mintemp, $6 = maxtemp
    // $7 = onebed, $8 = twobed, $9 = threebed, $10 = fourbed, $11 = fivebed, $12 = singlefamily
    db.query(
	'(SELECT A.state, A.county, A.city, \'One-Bedroom\' AS HouseType, A.price, ' +
              'C.latitude, C.longitude,C.median_age, C.mean_earnings, C.per_capita_income, T.avg_f AS avg_temp ' + 
//              'C.median_age, C.mean_earnings, C.per_capita_income, C.latitude, C.longitude, T.avg_f AS avg_temp ' +
         'FROM onebedroomprice AS A, census AS C, Temperature AS T ' +
//         'FROM onebedroomprice AS A, census AS C, Temperature AS T, zipcodes AS Z ' +
	 'WHERE A.state LIKE $1 AND A.city LIKE $2 AND A.price > $3 AND A.price < $4 ' +
               'AND C.city = A.city AND C.state = A.state ' +
	       'AND T.county = A.county AND T.state = A.state ' +
               'AND T.avg_f > $5 AND T.avg_f < $6 AND $7 = 1) ' +
//               'AND Z.city = A.city AND Z.state = A.state ' +
     'UNION ' +

	'(SELECT A.state, A.county, A.city, \'Two-Bedroom\' AS HouseType, A.price, ' +
                'C.latitude, C.longitude, C.median_age, C.mean_earnings, C.per_capita_income, T.avg_f AS avg_temp ' +
         'FROM twobedroomprice AS A, census AS C, Temperature AS T ' +
         'WHERE A.state LIKE $1 AND A.city LIKE $2 AND A.price > $3 AND A.price < $4 ' +
               'AND C.city = A.city AND C.state = A.state ' +
               'AND T.county = A.county AND T.state = A.state ' +
               'AND T.avg_f > $5 AND T.avg_f < $6 AND $8 = 1) ' +

     'UNION ' +

	'(SELECT A.state, A.county, A.city, \'Three-Bedroom\' AS HouseType, A.price, ' +
                'C.latitude, C.longitude, C.median_age, C.mean_earnings, C.per_capita_income, T.avg_f AS avg_temp ' +
         'FROM threebedroomprice AS A, census AS C, Temperature AS T ' +
         'WHERE A.state LIKE $1 AND A.city LIKE $2 AND A.price > $3 AND A.price < $4 ' +
               'AND C.city = A.city AND C.state = A.state ' +
               'AND T.county = A.county AND T.state = A.state ' +
               'AND T.avg_f > $5 AND T.avg_f < $6 AND $9 = 1) ' +

     'UNION ' +

	'(SELECT A.state, A.county, A.city, \'Four-Bedroom\' AS HouseType, A.price, ' +
                'C.latitude, C.longitude, C.median_age, C.mean_earnings, C.per_capita_income, T.avg_f AS avg_temp ' +
         'FROM fourbedroomprice AS A, census AS C, Temperature AS T ' +
         'WHERE A.state LIKE $1 AND A.city LIKE $2 AND A.price > $3 AND A.price < $4 ' +
               'AND C.city = A.city AND C.state = A.state ' +
               'AND T.county = A.county AND T.state = A.state ' +
               'AND T.avg_f > $5 AND T.avg_f < $6 AND $10 = 1) ' +

     'UNION ' +

	'(SELECT A.state, A.county, A.city, \'FivePlus-Bedroom\' AS HouseType, A.price, ' +
                'C.latitude, C.longitude, C.median_age, C.mean_earnings, C.per_capita_income, T.avg_f AS avg_temp ' +
         'FROM fiveormorebedroomprice AS A, census AS C, Temperature AS T ' +
         'WHERE A.state LIKE $1 AND A.city LIKE $2 AND A.price > $3 AND A.price < $4 ' +
               'AND C.city = A.city AND C.state = A.state ' +
               'AND T.county = A.county AND T.state = A.state ' +
               'AND T.avg_f > $5 AND T.avg_f < $6 AND $11 = 1) ' +

     'UNION ' +

	'(SELECT A.state, A.county, A.city, \'SingleFamilyResidence\' AS HouseType, A.price, ' +
                'C.latitude, C.longitude, C.median_age, C.mean_earnings, C.per_capita_income, T.avg_f AS avg_temp ' +
         'FROM singlefamilyresidenceprice AS A, census AS C, Temperature AS T ' +
         'WHERE A.state LIKE $1 AND A.city LIKE $2 AND A.price > $3 AND A.price < $4 ' +
               'AND C.city = A.city AND C.state = A.state ' +
               'AND T.county = A.county AND T.state = A.state ' +
               'AND T.avg_f > $5 AND T.avg_f < $6 AND $12 = 1) ' +
	 'ORDER BY state, county, city, housetype ASC',

	 [state, city, minprice, maxprice, mintemp, maxtemp,
	  onebedroom,twobedroom,threebedroom,fourbedroom,fiveormorebedroom,singlefamilyresidence], 
        (err, results) => {
            if (err) {
                throw err
            }

            // Begin Scoring Results

            price_range = maxprice - minprice
            mid_temp = mintemp + ( ( maxtemp - mintemp ) / 2 )
            for (var i = 0; i < results.rows.length; i++) {
                distance = distanceFromLatLon(results.rows[i].latitude,results.rows[i].longitude,inLat,inLon);
                if (distance > max_dist) {
                  results.rows[i]["distance"] = -1
                  results.rows[i]["score"] = -1 
                }
                else {
                  results.rows[i]["distance"] = distance;
                  distance_score = 1 - ( distance / max_dist )
                  price_offset = results.rows[i].price - minprice
                  price_score = ( 1 - ( price_offset / price_range ) ) * 100
                  temp_offset = Math.abs(results.rows[i].avg_temp - mid_temp)
            
                  temp_score = ( 1 - ( temp_offset / ( mid_temp - mintemp + 0.01) ) ) * 100

                  //score median_age, 23.3=1 to 72.6=0
                  age_offset = results.rows[i].median_age - 23.3
                  age_score = ( 1 - ( age_offset / 49.3 ) ) * 100

                  //score median_earnings, 246996=1 to 39898=0 
                  earnings_offset = results.rows[i].mean_earnings - 39898
                  earnings_score = ( earnings_offset / 207098 ) * 100 

                  calculated_score = (price_score + temp_score + distance_score + age_score + earnings_score) / 4
                  results.rows[i]["score"] = calculated_score
                }
//                console.log("row ", i, ": ", results.rows[i])
            }
            results.rows.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
            results.rows.splice(10)
            // End Scoring Results
            response.status(200).json(results.rows)
        })

    

    // Begin querying each housing table
    // final = ""
    // if (onebedroom) {
    //     results = await db.query('SELECT * FROM onebedroomprice WHERE state LIKE $1 AND city LIKE $2 AND price > $3 AND price < $4', 
    //  [state, city, minprice, maxprice], 
    //    (err, results) => {
    //        if (err) {
    //            throw err
    //        }
    //         for (var i = 0; i < results.rows.length; i++) {
    //             results.rows[i]["type"] = "One-Bedrooms"
    //         }
    //         if (final == "") {
    //             final = results.rows
    //         } else {
    //             final = final.concat(results.rows)
    //         }
    //    })
    //}    

    // if (twobedroom) {
    //     results = await db.query('SELECT * FROM twobedroomprice WHERE state LIKE $1 AND city LIKE $2 AND price > $3 AND price < $4', 
    //     [state, city, minprice, maxprice], 
    //     (err) => {
    //         if (err) {
    //             throw err
    //         }
    //         for (var i = 0; i < results.rows.length; i++) {
    //             results.rows[i]["type"] = "Two-Bedrooms"
    //         }
    //         if (final == "") {
    //             final = results.rows
    //         } else {
    //             final = final.concat(results.rows)
    //         }
    //     })
    // }

    // if (threebedroom) {
    //     results = await db.query('SELECT * FROM threebedroomprice WHERE state LIKE $1 AND city LIKE $2 AND price > $3 AND price < $4', 
    //     [state, city, minprice, maxprice], 
    //     (err, results) => {
    //         if (err) {
    //             throw err
    //         }
    //         for (var i = 0; i < results.rows.length; i++) {
    //             results.rows[i]["type"] = "Three-Bedrooms"
    //         }
    //         if (final == "") {
    //             final = results.rows
    //         } else {
    //             final = final.concat(results.rows)
    //         }
    //     })
    // }

    // if (fourbedroom) {
    //     results = await db.query('SELECT * FROM fourbedroomprice WHERE state LIKE $1 AND city LIKE $2 AND price > $3 AND price < $4', 
    //     [state, city, minprice, maxprice], 
    //     (err, results) => {
    //         if (err) {
    //             throw err
    //         }
    //         for (var i = 0; i < results.rows.length; i++) {
    //             results.rows[i]["type"] = "Four-Bedrooms"
    //         }
    //         if (final == "") {
    //             final = results.rows
    //         } else {
    //             final = final.concat(results.rows)
    //         }
    //     })
    // }

    // if (fiveormorebedroom) {
    //     results = await db.query('SELECT * FROM fiveormorebedroomprice WHERE state LIKE $1 AND city LIKE $2 AND price > $3 AND price < $4', 
    //     [state, city, minprice, maxprice], 
    //     (err, results) => {
    //         if (err) {
    //             throw err
    //         }
    //         for (var i = 0; i < results.rows.length; i++) {
    //             results.rows[i]["type"] = "FiveorMore-Bedrooms"
    //         }
    //         if (final == "") {
    //             final = results.rows
    //         } else {
    //             final = final.concat(results.rows)
    //         }
    //     })
    // }

    // if (singlefamilyresidence) {
    //     results = await db.query('SELECT * FROM singlefamilyresidenceprice WHERE state LIKE $1 AND city LIKE $2 AND price > $3 AND price < $4', 
    //     [state, city, minprice, maxprice], 
    //     (err, results) => {
    //         if (err) {
    //             throw err
    //         }
    //         for (var i = 0; i < results.rows.length; i++) {
    //             results.rows[i]["type"] = "FiveorMore-Bedrooms"
    //         }
    //         if (final == "") {
    //             final = results.rows
    //         } else {
    //             final = final.concat(results.rows)
    //         }
    //     })
    // }
    // response.status(200).json(final)
}

function distanceFromLatLon(lat1,lon1,lat2,lon2) {
  var R = 3958.8; 
  var degLat = deg2rad(lat2-lat1);  // deg2rad below
  var degLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(degLat/2) * Math.sin(degLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(degLon/2) * Math.sin(degLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; 
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

module.exports = {
    getPreferredResult
}
