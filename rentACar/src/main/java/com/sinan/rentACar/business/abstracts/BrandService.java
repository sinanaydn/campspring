package com.sinan.rentACar.business.abstracts;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sinan.rentACar.business.requests.CreateBrandRequest;
import com.sinan.rentACar.business.requests.UpdateBrandRequest;
import com.sinan.rentACar.business.responses.GetAllBrandsResponse;
import com.sinan.rentACar.business.responses.GetByIdBrandResponse;

public interface BrandService {
    Page<GetAllBrandsResponse> getAll(Pageable pageable);
    GetByIdBrandResponse getById(int id);
    void add(CreateBrandRequest createBrandRequest);
    void update(UpdateBrandRequest updateBrandRequest);
    void delete(int id);
}
