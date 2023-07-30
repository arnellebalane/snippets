import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CreateSnippet } from '~/views/CreateSnippet/CreateSnippet';
import { ViewSnippet } from '~/views/ViewSnippet/ViewSnippet';

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<CreateSnippet />} />
                <Route path=":hash" element={<ViewSnippet />} />
            </Routes>
        </BrowserRouter>
    );
};
