import moxios = require('moxios')
import { isMainThread } from 'worker_threads';

describe('Client', function (){
    describe('getTournamentTypes', function(){
        beforeEach(function(){
            moxios.install()
        })

        afterEach(function (){
            moxios.uninstall()
        })

        it('returns tournament types', function (){
            moxios.stubRequest('/tournaments/types/', {
                status: 200,
                response: [
                    {
                        id: 0,
                        name: 'TYPE_A',
                        
                    }
                ]
            })
        })
    })
})