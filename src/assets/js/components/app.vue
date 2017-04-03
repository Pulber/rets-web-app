<style lang="less">
  .app-content {
    max-width: 800px;
    margin: 10% auto;
  }
</style>

<template>
  <div class="app-content">
    <div class="container-fluid">
      <template v-if="fetching">
        <div class="alert alert-info">Loading...</div>
      </template>

      <template v-if="error">
        <div class="alert alert-danger">{{ error }}</div>
      </template>
      
      <div class="row">
        <div class="col-md-6">
          <div class="panel panel-default">
            <div class="panel-heading">RETS Credentials</div>
            <div class="panel-body">
              <form @submit.prevent="getPropertyClasses">
                <div class="form-group">
                  <label for="retsUsername">Username</label>
                  <input type="text" id="retsUsername" class="form-control" :disabled="hasConnected || fetching" v-model.trim="credentials.username"/>
                </div>
                <div class="form-group">
                  <label for="retsPassword">Password</label>
                  <input type="text" id="retsPassword" class="form-control" :disabled="hasConnected || fetching" v-model.trim="credentials.password"/>
                </div>
                <div class="form-group">
                  <label for="retsUrl">Url</label>
                  <input type="text" id="retsUrl" class="form-control" :disabled="hasConnected || fetching" v-model.trim="credentials.loginUrl"/>
                </div>
                
                <button type="submit" class="btn btn-primary" :disabled="hasConnected || fetching">Connect</button>
                <button type="button" class="btn btn-default" @click.prevent="reset" :disabled="fetching">Reset</button>
              </form>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="panel panel-default">
            <div class="panel-heading">RETS Query</div>
            <div class="panel-body">
              <form @submit.prevent="getListing">
                <div class="form-group">
                  <select class="form-control" :disabled="!hasConnected || fetching" v-model="queryParams.propertyClass">
                    <option value="">Select property type</option>
                    <option v-for="propertyClass in propertyClasses" :value="propertyClass.id">{{ propertyClass.title }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <select class="form-control" :disabled="!hasConnected || fetching" v-model="queryParams.county">
                    <option value="">Select county</option>
                    <option v-for="county in searchCounties" :value="county.id">{{ county.title }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <input type="text" class="form-control" :disabled="!hasConnected || fetching" v-model.trim="queryParams.mls"/>
                </div>
                
                <button type="submit" class="btn btn-primary" :disabled="!hasConnected || fetching">Get Results</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="listingData" class="panel panel-default">
        <div class="panel-heading">RETS Listing</div>
        <div class="panel-body">
          <p v-for="row in listingData"><b>{{ row.title }}:</b> {{ row.value }}</p>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  
  export default {
    data() {
      return {
        fetching: false,
        error: null,
        hasConnected: false,
        credentials: {
          username: '',
          password: '',
          loginUrl: ''
        },
        propertyClasses: [],
        searchCounties: [],
        queryParams: {
          propertyClass: '',
          county: '',
          mls: ''
        },
        listingData: null
      }
    },
    methods: {
      request(params) {
        return this.$http.get('/api', {
          params: params
        })
      },
      reset() {
        this.fetching = true
        location.reload()
      },
      getPropertyClasses() {
        this.fetching = true
        this.error = null
        
        this.request(Object.assign({}, {action: 'getPropertyClasses'}, this.credentials))
          .then(response => {
            this.fetching = false
            
            if (_.get(response, 'data.success', false)) {
              this.hasConnected = true
              this.propertyClasses = _.get(response, 'data.propertyClasses', [])
              this.searchCounties = _.get(response, 'data.searchCounties', [])
            } else {
              this.error = _.get(response, 'data.error', null)
            }
          })
      },
      getListing() {
        this.fetching = true
        this.error = null

        this.listingData = null
        
        this.request(Object.assign({}, {action: 'getListing'}, this.credentials, this.queryParams))
          .then(response => {
            this.fetching = false
            
            if (_.get(response, 'data.success', false)) {
              this.listingData = _.get(response, 'data.listingData', null)
            } else {
              this.error = _.get(response, 'data.error', null)
            }
          })
      }
    }
  }
</script>