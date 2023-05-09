import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreateSnippet } from 'views/CreateSnippet/CreateSnippet';

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<CreateSnippet />} />
            </Routes>
        </BrowserRouter>
    );
};
