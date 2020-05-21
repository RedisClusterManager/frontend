import { shallowMount, mount, createLocalVue} from "@vue/test-utils"
import App from "@/App.vue"
import VueRouter from "vue-router"
import Login from '@/components/views/Login.vue'
import Register from '@/components/views/Register.vue'
import Home from '@/components/views/Home.vue'
import AppId from '@/components/views/AppId.vue'
import Cluster from '@/components/views/Cluster.vue'
import AddCluster from '@/components/views/AddCluster.vue'
import routes from "@/routes.js"
const localVue = createLocalVue()
localVue.use(VueRouter)
describe("App", () => {
  it("renders Login component via routing", () => {
    const router = new VueRouter({
      routes
    })
    const wrapper = mount(App, {
      localVue,
      router
    })
    router.push("/Login")
    expect(wrapper.find(Login).exists()).toBe(true)
  })
})
