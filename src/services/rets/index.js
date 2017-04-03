'use strict';

const rets = require('rets-client')
const _ = require('lodash')

module.exports = function(){
  const app = this;
  
  app.use('/api', {
    clientSettings: {
      loginUrl: '',
      username: '',
      password: '',
      version: 'RETS/1.7.2',
      userAgent: '',
      userAgentPassword: ''
    },
    find(params, callback) {
      var action = params.query.action || ''
      
      this.clientSettings.loginUrl = params.query.loginUrl || ''
      this.clientSettings.username = params.query.username || ''
      this.clientSettings.password = params.query.password || ''
      this.clientSettings.userAgent = params.query.username || ''
      this.clientSettings.userAgentPassword = params.query.password || ''
      
      rets.getAutoLogoutClient(this.clientSettings, client => {
        if (action == 'getPropertyClasses') {
          
          return client.metadata.getClass('Property')
            .then(data => {
              var propertyClasses = _.map(data.results[0].metadata, propertyClass => {
                return {
                  id: parseInt(propertyClass.ClassName),
                  title: propertyClass.Description
                }
              })

              return client.metadata.getLookupTypes('Property')
                .then(data => {
                  callback(null, {
                    success: true,
                    propertyClasses: propertyClasses,
                    searchCounties: _.map(_.filter(data.results, lookup => {return lookup.info.Lookup === '1_6'})[0].metadata, metadata => {
                      return {
                        id: metadata.Value,
                        title: metadata.LongValue
                      }
                    })
                  })
                })
            })
          
        } else if (action === 'getListing') {
          
          var propertyClass = params.query.propertyClass || '',
              county = params.query.county || '',
              mls = params.query.mls || ''
              
          return new Promise((resolve, reject) => {
            if (!propertyClass || !county || !mls) {
              return reject('Missing required search parameters.')
            }

            return resolve()
          })
          .then(() => {
            return client.metadata.getTable('Property', propertyClass)
          })
          .then(data => {
            return _.map(data.results[0].metadata, field => {
              return {
                id: field.SystemName,
                title: field.LongName || field.ShortName
              }
            })
          })
          .then(fields => {
            return client.search.query('Property', propertyClass, `(246=|A,B,C,CS,PS,R,Q,T,W,X),(61=|${county}),(157=${mls})`, {limit: 1})
              .then(data => {
                callback(null, {
                  success: true,
                  listingData: _.map(data.results[0], (val, key) => {
                    return {
                      key: key,
                      title: _.find(fields, {id: key}).title,
                      value: val || '-'
                    }
                  })
                })
              })
          })
        
        }
      }).catch(error => {
        callback(null, {
          success: false,
          error: error.message || error
        })
      })
    },
    // get(id, params) {},
    // create(data, params) {},
    // update(id, data, params) {},
    // patch(id, data, params) {},
    // remove(id, params) {},
    // setup(app, path) {}
  })
}