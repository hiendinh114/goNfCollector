package database

import (
	"fmt"
	"time"

	"github.com/goNfCollector/configurations"
	"github.com/goNfCollector/database/model"
	"github.com/sirupsen/logrus"
)

// write geo into database if not exist yet
// otherwise it will update the last seen
func (p *Postgres) writeGeo(ip string) (geoID uint, err error) {

	// get location
	loc := p.getLocation(ip)

	var geoModel model.Geo
	p.db.Where("country_short = ? AND country_long = ? AND region = ? AND city = ? AND latitude = ? AND longitude = ?",
		loc.Country_short, loc.Country_long, loc.Region, loc.City,
		loc.Latitude, loc.Longitude,
	).First(&geoModel)

	if geoModel.ID == 0 {
		// not found
		// need to be inserted to db
		geoModel := model.Geo{
			CountryShort: loc.Country_short,
			CountryLong:  loc.Country_long,
			Region:       loc.Region,
			City:         loc.City,
			Latitude:     loc.Latitude,
			Longitude:    loc.Longitude,
		}

		// insert to db
		result := p.db.Create(&geoModel)

		// check for error
		if result.Error != nil {
			p.Debuuger.Verbose(fmt.Sprintf("[%d]-%s: (%v)",
				configurations.ERROR_CAN_T_INSERT_GEO_INFO.Int(),
				configurations.ERROR_CAN_T_INSERT_GEO_INFO, err),
				logrus.ErrorLevel,
			)
			return 0, result.Error
		}

		return geoModel.ID, nil

	} else {
		// found and updated_at date/time must be updated
		result := p.db.Model(&geoModel).Update("updated_at", time.Now())

		// check for error
		// since we want to update just one
		// field in the database (updated_at)
		// we will continue with no error
		// but logs must be generated to the checked to
		// the log file for future investigations
		if result.Error != nil {
			p.Debuuger.Verbose(fmt.Sprintf("[%d]-%s: (%v)",
				configurations.ERROR_CAN_T_UPDATE_GEO_INFO.Int(),
				configurations.ERROR_CAN_T_UPDATE_GEO_INFO, err),
				logrus.ErrorLevel,
			)
		}
		return geoModel.ID, nil
	}
}
