import { server } from '../config';
import axios from "axios";

function Peraturanjdihn({ data }) {
  return (
    <div>
      <h1>Peraturan JDIHN</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const resOpt = {
      credentials: 'same-origin',
      url: `${server}/api/jdihndata`,
      method: 'POST',
      timeout: 3000,
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8' 
      },
      data: ""
    };
    const response = await axios(resOpt);
    const isidata = await response.data;
    
    return {
      props: {
        data: isidata
      }
    };
  } catch (error) {
    return {
      props: {
        data: []
      }
    };
  }
}

export default Peraturanjdihn