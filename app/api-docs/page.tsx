'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocs = () => {
  return (
    <div style={{ height: '100vh' }}>
      <SwaggerUI url="/api/openapi" /> {/* Point to your OpenAPI JSON endpoint */}
    </div>
  );
};

export default ApiDocs;
